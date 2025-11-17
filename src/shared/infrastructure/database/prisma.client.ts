import { PrismaClient } from '@/prisma/generated/prisma/client';
import { logger } from '../logger/pino.logger';

/**
 * Prisma Database Client
 * Singleton pattern with query logging and performance monitoring
 */
class DatabaseClient {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient({
        log: [
          {
            emit: 'event',
            level: 'query',
          },
          {
            emit: 'event',
            level: 'error',
          },
          {
            emit: 'event',
            level: 'warn',
          },
        ],
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });

      DatabaseClient.setupEventHandlers();
      DatabaseClient.setupGracefulShutdown();
    }

    return DatabaseClient.instance;
  }

  private static setupEventHandlers(): void {
    const prisma = DatabaseClient.instance;

    // Query logging with slow query detection
    prisma.$on('query' as never, (e: { query: string; duration: number; params: string }) => {
      if (e.duration > 1000) {
        logger.warn(
          {
            query: e.query,
            params: e.params,
            duration: e.duration,
          },
          'Slow query detected (>1s)'
        );
      } else if (process.env.NODE_ENV === 'development') {
        logger.debug(
          {
            query: e.query,
            duration: e.duration,
          },
          'Database query executed'
        );
      }
    });

    // Error logging
    prisma.$on('error' as never, (e: { message: string; target: string }) => {
      logger.error(
        {
          message: e.message,
          target: e.target,
        },
        'Database error'
      );
    });

    // Warning logging
    prisma.$on('warn' as never, (e: { message: string; target: string }) => {
      logger.warn(
        {
          message: e.message,
          target: e.target,
        },
        'Database warning'
      );
    });
  }

  private static setupGracefulShutdown(): void {
    if (process.env.NODE_ENV === 'production') {
      process.on('beforeExit', async () => {
        logger.info('Disconnecting from database...');
        await DatabaseClient.instance.$disconnect();
      });
    }
  }

  /**
   * Execute operations within a transaction
   */
  public static async transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    const prisma = DatabaseClient.getInstance();
    return prisma.$transaction(async (tx) => fn(tx as PrismaClient));
  }
}

// Export singleton instance
export const prisma = DatabaseClient.getInstance();
export const db = prisma; // Alias for convenience

// Export PrismaClient class and transaction helper
export { PrismaClient } from '@/prisma/generated/prisma/client';
export const executeInTransaction = DatabaseClient.transaction;
