import { PrismaClient } from '@/prisma/generated/prisma/client';
import { logger } from '../logger/logger';
import { isDevelopment } from '../env';

/**
 * Prisma Client Configuration
 * - Singleton pattern to prevent multiple instances
 * - Query logging in development
 * - Slow query detection
 * - Connection pooling optimization
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
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
    // Connection pool settings (for serverless environments)
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Global type for Prisma singleton
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Query logging and performance monitoring
if (isDevelopment) {
  // Log all queries in development
  prisma.$on('query' as never, (e: { query: string; duration: number; params: string }) => {
    // Warn about slow queries (> 1 second)
    if (e.duration > 1000) {
      logger.warn(
        {
          query: e.query,
          params: e.params,
          duration: e.duration,
        },
        'Slow query detected'
      );
    } else {
      // Log all queries in development
      logger.debug(
        {
          query: e.query,
          duration: e.duration,
        },
        'Database query'
      );
    }
  });

  // Log errors
  prisma.$on('error' as never, (e: { message: string; target: string }) => {
    logger.error(
      {
        message: e.message,
        target: e.target,
      },
      'Database error'
    );
  });

  // Log warnings
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

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
