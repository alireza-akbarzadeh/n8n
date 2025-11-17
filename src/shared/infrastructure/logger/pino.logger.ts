import pino from 'pino';

/**
 * Structured Logger using Pino
 * Centralized logging service for the entire application
 */
class Logger {
  private static instance: pino.Logger;

  private constructor() {}

  public static getInstance(): pino.Logger {
    if (!Logger.instance) {
      Logger.instance = pino({
        level: process.env.LOG_LEVEL || 'info',

        // Simple console output (no worker threads to avoid Next.js issues)
        browser: {
          asObject: true,
        },

        // Base fields in every log
        base: {
          env: process.env.NODE_ENV,
        },

        // Redact sensitive data
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
            'credentials',
            '*.credentials',
          ],
          censor: '[REDACTED]',
        },

        // Serializers for common objects
        serializers: {
          err: pino.stdSerializers.err,
          req: pino.stdSerializers.req,
          res: pino.stdSerializers.res,
        },

        // Format level labels
        formatters: {
          level: (label) => {
            return { level: label.toUpperCase() };
          },
        },
      });
    }

    return Logger.instance;
  }

  /**
   * Create a child logger with additional context
   */
  public static createChild(bindings: Record<string, unknown>): pino.Logger {
    return Logger.getInstance().child(bindings);
  }

  /**
   * Create a timer for measuring operation duration
   */
  public static createTimer() {
    const start = Date.now();
    return (bindings: Record<string, unknown>, message: string) => {
      const duration = Date.now() - start;
      Logger.getInstance().info({ ...bindings, duration }, message);
    };
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export helper functions
export const createLogger = Logger.createChild;
export const startTimer = Logger.createTimer;

// Export default
export default logger;
