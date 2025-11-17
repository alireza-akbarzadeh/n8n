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

/**
 * Initialize Redis client (singleton)
 */
function getRedis(): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    logger.warn(
      'Rate limiting is disabled: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured'
    );
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
    logger.info('Redis client initialized for rate limiting');
  }

  return redis;
}

/**
 * Get rate limiter instance (singleton)
 * Uses sliding window algorithm with 10 requests per 10 seconds per user
 */
export function getRateLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) {
    return null;
  }

  if (!rateLimiter) {
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
    logger.error({ error, identifier }, 'Rate limit check failed');
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

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs}ms`),
    analytics: true,
    prefix: '@upstash/ratelimit',
  });
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
