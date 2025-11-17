/**
 * Example tRPC Router with Rate Limiting, Audit Logging, and Request Tracking
 *
 * This demonstrates how to use the enhanced tRPC features:
 * - Automatic rate limiting per user (configured in init.ts)
 * - Request ID tracking for debugging
 * - Audit logging for critical operations
 * - Performance monitoring for slow queries
 * - Error logging with context
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../init';
import { auditMiddleware } from '../middleware';
import { logger } from '@/lib/logger';

/**
 * Example router showing different usage patterns
 */
export const exampleRouter = createTRPCRouter({
  /**
   * Public procedure - no authentication or rate limiting
   */
  publicEndpoint: publicProcedure
    .input(z.object({ message: z.string() }))
    .query(({ input, ctx }) => {
      logger.info({ requestId: ctx.requestId, message: input.message }, 'Public endpoint called');
      return { success: true, message: input.message };
    }),

  /**
   * Protected procedure - requires authentication + rate limiting
   * Rate limiting is automatically applied in protectedProcedure
   */
  protectedEndpoint: protectedProcedure
    .input(z.object({ data: z.string() }))
    .query(({ input, ctx }) => {
      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          rateLimitRemaining: ctx.rateLimit?.remaining,
        },
        'Protected endpoint called'
      );
      return { success: true, data: input.data, userId: ctx.userId };
    }),

  /**
   * Create operation with automatic audit logging
   * The audit log will automatically capture:
   * - Action: CREATE
   * - Entity Type: WORKFLOW
   * - Entity ID: from the returned result
   * - User ID: from context
   * - Metadata: request path, duration, requestId
   */
  createWithAudit: auditMiddleware('CREATE', 'WORKFLOW')
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowName: input.name,
        },
        'Creating workflow with audit'
      );

      // Your business logic here
      const workflow = await ctx.db.workflow.create({
        data: {
          name: input.name,
          userId: ctx.userId!,
        },
      });

      // Return object with 'id' field for automatic audit logging
      return {
        id: workflow.id, // This will be picked up by auditMiddleware
        name: workflow.name,
        createdAt: workflow.createdAt,
      };
    }),

  /**
   * Update operation with audit logging
   */
  updateWithAudit: auditMiddleware('UPDATE', 'WORKFLOW')
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: input.id,
        },
        'Updating workflow with audit'
      );

      const workflow = await ctx.db.workflow.update({
        where: { id: input.id },
        data: {
          name: input.name,
          updatedAt: new Date(),
        },
      });

      return {
        id: workflow.id,
        name: workflow.name,
        updatedAt: workflow.updatedAt,
      };
    }),

  /**
   * Delete operation with audit logging
   */
  deleteWithAudit: auditMiddleware('DELETE', 'WORKFLOW')
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: input.id,
        },
        'Deleting workflow with audit'
      );

      await ctx.db.workflow.delete({
        where: { id: input.id },
      });

      return {
        id: input.id,
        deleted: true,
      };
    }),

  /**
   * Execute operation with audit logging
   * Uses EXECUTE action to track workflow runs
   */
  executeWithAudit: auditMiddleware('EXECUTE', 'WORKFLOW')
    .input(z.object({ workflowId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: input.workflowId,
        },
        'Executing workflow with audit'
      );

      // Create execution record
      const execution = await ctx.db.execution.create({
        data: {
          workflowId: input.workflowId,
          userId: ctx.userId!,
          status: 'PENDING',
          mode: 'MANUAL',
        },
      });

      // Start workflow execution (async)
      // ... your execution logic here

      return {
        id: input.workflowId, // Audit will log the workflow ID
        executionId: execution.id,
        status: execution.status,
      };
    }),

  /**
   * Manual audit logging example
   * When you need more control over audit data
   */
  manualAudit: protectedProcedure
    .input(z.object({ credentialId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { createAuditLog } = await import('@/lib/audit');

      // Fetch credential
      const credential = await ctx.db.credential.findUnique({
        where: { id: input.credentialId },
      });

      if (!credential) {
        throw new Error('Credential not found');
      }

      // Manual audit log with custom metadata
      await createAuditLog({
        action: 'VIEW',
        entityType: 'CREDENTIAL',
        entityId: credential.id,
        userId: ctx.userId,
        credentialId: credential.id,
        metadata: {
          requestId: ctx.requestId,
          credentialType: credential.type,
          credentialName: credential.name,
          ipAddress: 'TODO: extract from headers',
        },
      });

      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          credentialId: credential.id,
        },
        'Credential viewed with manual audit'
      );

      return {
        id: credential.id,
        name: credential.name,
        type: credential.type,
        lastUsedAt: credential.lastUsedAt,
      };
    }),

  /**
   * Performance-sensitive endpoint
   * Automatically logs if request takes > 1000ms
   */
  slowOperation: protectedProcedure
    .input(z.object({ iterations: z.number() }))
    .query(async ({ input, ctx }) => {
      logger.debug(
        {
          requestId: ctx.requestId,
          iterations: input.iterations,
        },
        'Starting potentially slow operation'
      );

      // Simulate work
      let result = 0;
      for (let i = 0; i < input.iterations; i++) {
        result += Math.sqrt(i);
      }

      return { result, iterations: input.iterations };
    }),
});
