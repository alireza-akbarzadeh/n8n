import { env } from '@/src/core';
import pino from 'pino';

/**
 * Structured logger using Pino
 *
 * Usage:
 * ```typescript
 * logger.info('User logged in', { userId: '123' });
 * logger.error({ err, requestId }, 'Request failed');
 * logger.warn({ duration: 1500 }, 'Slow query detected');
 * ```
 */
// Disable async logging to avoid worker thread issues with Next.js/Turbopack
// This fixes "Cannot find module 'thread-stream/lib/worker.js'" errors
export const logger = pino({
  level: env.LOG_LEVEL || 'info',

  // Simple browser-friendly console output (no worker threads)
  browser: {
    asObject: true,
  },

  // Base fields to include in every log
  base: {
    env: env.NODE_ENV,
  },

  // Redact sensitive fields
  redact: {
    paths: [
      'password',
      'token',
      'apiKey',
      'secret',
      'authorization',
      '*.password',
      '*.token',
      '*.apiKey',
      '*.secret',
    ],
    censor: '[REDACTED]',
  },

  // Serializers for common objects
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  // Format error stack traces
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

/**
 * Create a child logger with additional context
 *
 * @example
 * const requestLogger = createLogger({ requestId: '123' });
 * requestLogger.info('Processing request');
 */
export function createLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}

/**
 * Log timing information for operations
 *
 * @example
 * const end = logger.startTimer();
 * await someOperation();
 * end({ operation: 'database-query' }, 'Query completed');
 */
export function startTimer() {
  const start = Date.now();
  return (bindings: Record<string, unknown>, message: string) => {
    const duration = Date.now() - start;
    logger.info({ ...bindings, duration }, message);
  };
}

// Export logger instance as default
export default logger;
