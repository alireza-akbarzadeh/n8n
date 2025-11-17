import { TRPCError } from '@trpc/server';
import type { AuditAction, EntityType } from '@/prisma/generated/prisma/enums';
import { createAuditLog } from '@/lib/audit';
import { logger } from '@/lib/logger';
import { protectedProcedure } from './init';

/**
 * tRPC Middleware for automatic audit logging
 * Usage: auditMiddleware('CREATE', 'WORKFLOW')
 */
export function auditMiddleware(action: AuditAction, entityType: EntityType) {
  return protectedProcedure.use(async ({ ctx, next, path }) => {
    const startTime = Date.now();

    logger.debug(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        action,
        entityType,
        path,
      },
      'Audit middleware: request started'
    );

    try {
      const result = await next({ ctx });

      // Extract entity ID from result if available
      const entityId = extractEntityId(result, entityType);

      if (entityId) {
        await createAuditLog({
          action,
          entityType,
          entityId,
          userId: ctx.userId,
          metadata: {
            path,
            duration: Date.now() - startTime,
            requestId: ctx.requestId,
          },
        });

        logger.info(
          {
            requestId: ctx.requestId,
            userId: ctx.userId,
            action,
            entityType,
            entityId,
            duration: Date.now() - startTime,
          },
          'Audit log created'
        );
      }

      return result;
    } catch (error) {
      logger.error(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          action,
          entityType,
          path,
          error,
        },
        'Audit middleware: request failed'
      );
      throw error;
    }
  });
}

/**
 * Extract entity ID from tRPC result
 */
function extractEntityId(result: unknown, entityType: EntityType): string | null {
  if (!result || typeof result !== 'object') {
    return null;
  }

  const data = result as Record<string, unknown>;

  // Try common ID field names
  if (typeof data.id === 'string') {
    return data.id;
  }

  // For workflow-specific responses
  if (entityType === 'WORKFLOW' && typeof data.workflowId === 'string') {
    return data.workflowId;
  }

  // For execution-specific responses
  if (entityType === 'EXECUTION' && typeof data.executionId === 'string') {
    return data.executionId;
  }

  // For credential-specific responses
  if (entityType === 'CREDENTIAL' && typeof data.credentialId === 'string') {
    return data.credentialId;
  }

  return null;
}

/**
 * Create performance monitoring middleware
 * Logs slow requests (>1000ms)
 */
export function createPerformanceMiddleware(slowThresholdMs = 1000) {
  return async ({
    ctx,
    next,
    path,
  }: {
    ctx: Record<string, unknown>;
    next: () => Promise<unknown>;
    path: string;
  }) => {
    const startTime = Date.now();

    const result = await next();

    const duration = Date.now() - startTime;

    if (duration > slowThresholdMs) {
      logger.warn(
        {
          requestId: (ctx as { requestId?: string }).requestId,
          userId: (ctx as { userId?: string }).userId,
          path,
          duration,
        },
        'Slow tRPC request detected'
      );
    } else {
      logger.debug(
        {
          requestId: (ctx as { requestId?: string }).requestId,
          path,
          duration,
        },
        'tRPC request completed'
      );
    }

    return result;
  };
}

/**
 * Create error handling middleware
 */
export function createErrorLoggingMiddleware() {
  return async ({
    ctx,
    next,
    path,
  }: {
    ctx: Record<string, unknown>;
    next: () => Promise<unknown>;
    path: string;
  }) => {
    try {
      return await next();
    } catch (error) {
      if (error instanceof TRPCError) {
        logger.error(
          {
            requestId: (ctx as { requestId?: string }).requestId,
            userId: (ctx as { userId?: string }).userId,
            path,
            code: error.code,
            message: error.message,
          },
          'tRPC error occurred'
        );
      } else {
        logger.error(
          {
            requestId: (ctx as { requestId?: string }).requestId,
            userId: (ctx as { userId?: string }).userId,
            path,
            error,
          },
          'Unexpected error in tRPC procedure'
        );
      }
      throw error;
    }
  };
}
