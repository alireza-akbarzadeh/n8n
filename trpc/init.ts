import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z, ZodError } from 'zod';

import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { polarClient } from '@/lib/polar';

export type TRPCContext = {
  db: typeof prisma;
};

export const createTRPCContext = async (): Promise<TRPCContext> => {
  return {
    db: prisma,
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

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.session?.userId;

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  }

  return next({
    ctx: {
      ...ctx,
      userId,
      auth: session,
      isAuthenticated: Boolean(userId),
    },
  });
});

export const premiumProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const custumer = await polarClient.customers.getStateExternal({
    externalId: ctx.userId!,
  });
  if (!custumer.activeSubscriptions || custumer.activeSubscriptions.length === 0) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Active subscription required' });
  }

  return next({
    ctx: {
      ...ctx,
      custumer,
    },
  });
});
