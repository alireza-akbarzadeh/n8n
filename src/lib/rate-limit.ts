import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { env } from './env';
import { logger } from './logger';

/**
 * Rate limiting utilities using Upstash Redis
 * Protects API routes from abuse
 */

let redis: Redis | null = null;
let rateLimiter: Ratelimit | null = null;

let redisFailureCount = 0; // Incremented on failures for circuit breaker
const MAX_FAILURES_BEFORE_DISABLE = 3;

/**
 * Check if rate limiting should be attempted
 * Implements circuit breaker pattern to avoid repeated failures
 */
function shouldAttemptRateLimit(): boolean {
  if (redisFailureCount >= MAX_FAILURES_BEFORE_DISABLE) {
    logger.warn(
      { failures: redisFailureCount },
      'Rate limiting disabled due to repeated Redis failures'
    );
    return false;
  }
  return true;
}

/**
 * Initialize Redis client (singleton)
 */
function getRedis(): Redis | null {
  // Check if rate limiting is disabled via env var
  if (process.env.RATE_LIMIT_ENABLED === 'false') {
    logger.info('Rate limiting is disabled via RATE_LIMIT_ENABLED=false');
    return null;
  }

  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    logger.warn(
      'Rate limiting is disabled: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured'
    );
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
        retry: {
          retries: 2,
          backoff: (retryCount) => Math.min(retryCount * 50, 500),
        },
      });
      logger.info('Redis client initialized for rate limiting');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize Redis client');
      return null;
    }
  }

  return redis;
}

/**
 * Get rate limiter instance (singleton)
 * Uses sliding window algorithm with configurable limits
 */
export function getRateLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) {
    return null;
  }

  if (!rateLimiter) {
    try {
      rateLimiter = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(
          env.API_RATE_LIMIT_MAX,
          env.API_RATE_LIMIT_WINDOW as `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`
        ),
        analytics: true,
        prefix: '@upstash/ratelimit',
      });
      logger.info(
        {
          max: env.API_RATE_LIMIT_MAX,
          window: env.API_RATE_LIMIT_WINDOW,
        },
        'Rate limiter initialized'
      );
    } catch (error) {
      logger.error({ error }, 'Failed to initialize rate limiter');
      return null;
    }
  }

  return rateLimiter;
}

/**
 * Check rate limit for a given identifier (e.g., user ID, IP address)
 * @param identifier - Unique identifier (user ID, IP, etc.)
 * @returns Rate limit result
 */
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending?: Promise<unknown>;
}> {
  // Circuit breaker: skip if too many failures
  if (!shouldAttemptRateLimit()) {
    return {
      success: true,
      limit: env.API_RATE_LIMIT_MAX,
      remaining: env.API_RATE_LIMIT_MAX,
      reset: Date.now() + 10000,
    };
  }

  const limiter = getRateLimiter();

  // If rate limiting is disabled, allow all requests
  if (!limiter) {
    logger.debug({ identifier }, 'Rate limiting disabled, allowing request');
    return {
      success: true,
      limit: env.API_RATE_LIMIT_MAX,
      remaining: env.API_RATE_LIMIT_MAX,
      reset: Date.now() + 10000,
    };
  }

  try {
    const result = await limiter.limit(identifier);

    // Reset failure count on success
    redisFailureCount = 0;

    logger.debug(
      {
        identifier,
        success: result.success,
        remaining: result.remaining,
        reset: new Date(result.reset),
      },
      'Rate limit check'
    );

    return result;
  } catch (error) {
    // Increment failure count
    redisFailureCount++;

    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        identifier,
        failureCount: redisFailureCount,
      },
      'Rate limit check failed'
    );

    // On error, allow the request but log the issue
    return {
      success: true,
      limit: env.API_RATE_LIMIT_MAX,
      remaining: env.API_RATE_LIMIT_MAX,
      reset: Date.now() + 10000,
    };
  }
}

/**
 * Check rate limit and throw error if exceeded
 * @param identifier - Unique identifier (user ID, IP, etc.)
 * @throws Error if rate limit exceeded
 */
export async function requireRateLimit(identifier: string): Promise<void> {
  const result = await checkRateLimit(identifier);

  if (!result.success) {
    const resetDate = new Date(result.reset);
    throw new Error(
      `Rate limit exceeded. Try again in ${Math.ceil((result.reset - Date.now()) / 1000)} seconds (reset at ${resetDate.toISOString()})`
    );
  }
}

/**
 * Create a custom rate limiter with specific limits
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Custom rate limiter instance
 */
export function createCustomRateLimiter(maxRequests: number, windowMs: number): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) {
    return null;
  }

  try {
    return new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs}ms`),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  } catch (error) {
    logger.error({ error, maxRequests, windowMs }, 'Failed to create custom rate limiter');
    return null;
  }
}

/**
 * Reset rate limit for a specific identifier (admin use)
 * @param identifier - Unique identifier to reset
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const limiter = getRateLimiter();
  if (!limiter) {
    logger.warn('Cannot reset rate limit: limiter not initialized');
    return;
  }

  try {
    // The limiter doesn't expose a reset method directly,
    // but we can use Redis to delete the key
    const redisClient = getRedis();
    if (redisClient) {
      await redisClient.del(`@upstash/ratelimit:${identifier}`);
      logger.info({ identifier }, 'Rate limit reset');
    }
  } catch (error) {
    logger.error({ error, identifier }, 'Failed to reset rate limit');
    throw error;
  }
}
