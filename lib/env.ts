import { z } from 'zod';

/**
 * Environment variable validation schema
 * This ensures all required environment variables are present and valid at startup
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Database
  DATABASE_URL: z.string().url().describe('PostgreSQL connection string'),

  // Better Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
    .describe('Secret for Better Auth session encryption'),

  BETTER_AUTH_URL: z.string().url().describe('Canonical URL of your site'),

  NEXT_PUBLIC_APP_NAME: z.string().default('Nodebase').describe('Application name'),

  // OAuth Providers
  GITHUB_CLIENT_ID: z.string().describe('GitHub OAuth client ID').optional(),

  GITHUB_CLIENT_SECRET: z.string().describe('GitHub OAuth client secret').optional(),

  // Inngest (Background Jobs)
  INNGEST_EVENT_KEY: z.string().describe('Inngest event key for background jobs').optional(),

  INNGEST_SIGNING_KEY: z
    .string()
    .describe('Inngest signing key for webhook verification')
    .optional(),

  // AI / LLM Providers
  GOOGLE_GENERATIVE_AI_API_KEY: z
    .string()
    .describe('Google Generative AI (Gemini) API key')
    .optional(),

  // Monitoring & Error Tracking
  SENTRY_DSN: z.string().url().describe('Sentry DSN for error tracking').optional(),

  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url()
    .describe('Public Sentry DSN for client-side error tracking')
    .optional(),

  SENTRY_AUTH_TOKEN: z.string().describe('Sentry auth token for releases').optional(),

  // Logging
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info')
    .describe('Minimum log level'),

  // Rate Limiting (optional)
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url()
    .describe('Upstash Redis REST URL for rate limiting')
    .optional(),

  UPSTASH_REDIS_REST_TOKEN: z.string().describe('Upstash Redis REST token').optional(),

  // Feature Flags
  ENABLE_ANALYTICS: z
    .string()
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable analytics tracking'),

  // API Configuration
  API_RATE_LIMIT_MAX: z
    .string()
    .default('100')
    .transform((val) => parseInt(val, 10))
    .describe('Maximum API requests per window'),

  API_RATE_LIMIT_WINDOW: z.string().default('15m').describe('Rate limit window (e.g., 15m, 1h)'),
});

/**
 * Validated environment variables
 * @throws {ZodError} if environment validation fails
 */
export const env = envSchema.parse(process.env);

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Check if we're in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in test
 */
export const isTest = env.NODE_ENV === 'test';
