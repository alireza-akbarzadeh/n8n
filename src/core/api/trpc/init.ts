import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z, ZodError } from 'zod';

import prisma from '@/shared/infrastructure/database/db';
import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { polarClient } from '@/shared/application/services/polar';
import { getOrCreateRequestId } from '@/shared/infrastructure/request-id';
import { logger } from '@/shared/infrastructure/logger/pino.logger';
import { checkRateLimit } from '@/core/api/rate-limit';

export type TRPCContext = {
  db: typeof prisma;
  requestId: string;
  userId?: string;
  isAuthenticated: boolean;
};

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const headersList = await headers();
  const requestId = getOrCreateRequestId(headersList);

  logger.debug({ requestId }, 'tRPC context created');

  return {
    db: prisma,
    requestId,
    isAuthenticated: false,
  };
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? z.flattenError(error.cause) : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

/**
 * Middleware for authenticated procedures with rate limiting
 */
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.session?.userId;

  if (!session || !userId) {
    logger.warn({ requestId: ctx.requestId }, 'Unauthorized access attempt');
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  }

  // Apply rate limiting per user with error handling
  let rateLimitResult;
  try {
    rateLimitResult = await checkRateLimit(userId);
  } catch (error) {
    // If rate limit check completely fails, log and allow request
    logger.error(
      {
        requestId: ctx.requestId,
        userId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Rate limit check failed critically, allowing request'
    );
    rateLimitResult = {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 10000,
    };
  }

  if (!rateLimitResult.success) {
    logger.warn(
      {
        requestId: ctx.requestId,
        userId,
        remaining: rateLimitResult.remaining,
        resetAt: new Date(rateLimitResult.reset),
      },
      'Rate limit exceeded'
    );
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.reset - Date.now()) / 1000)} seconds`,
    });
  }

  logger.debug(
    {
      requestId: ctx.requestId,
      userId,
      rateLimitRemaining: rateLimitResult.remaining,
    },
    'Protected procedure authenticated'
  );

  return next({
    ctx: {
      ...ctx,
      userId,
      auth: session,
      isAuthenticated: true,
      rateLimit: rateLimitResult,
    },
  });
});

/**
 * Middleware for premium features requiring active subscription
 */
export const premiumProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const custumer = await polarClient.customers.getStateExternal({
    externalId: ctx.userId!,
  });

  if (!custumer.activeSubscriptions || custumer.activeSubscriptions.length === 0) {
    logger.warn(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
      },
      'Premium feature access denied - no active subscription'
    );
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Active subscription required' });
  }

  logger.debug(
    {
      requestId: ctx.requestId,
      userId: ctx.userId,
      subscriptions: custumer.activeSubscriptions.length,
    },
    'Premium procedure authorized'
  );

  return next({
    ctx: {
      ...ctx,
      custumer,
    },
  });
});
