import { z } from 'zod';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import {
  StartExecutionUseCase,
  CompleteExecutionUseCase,
  FailExecutionUseCase,
  GetExecutionsUseCase,
  GetExecutionDetailsUseCase,
} from '../application';
import { PrismaExecutionRepository } from '../infrastructure';
import { ExecutionStatus, ExecutionMode } from '../domain/entities/execution.entity';

// Initialize repository
const executionRepository = new PrismaExecutionRepository();

// Initialize use cases
const startExecutionUseCase = new StartExecutionUseCase(executionRepository);
const completeExecutionUseCase = new CompleteExecutionUseCase(executionRepository);
const failExecutionUseCase = new FailExecutionUseCase(executionRepository);
const getExecutionsUseCase = new GetExecutionsUseCase(executionRepository);
const getExecutionDetailsUseCase = new GetExecutionDetailsUseCase(executionRepository);

export const executionRouter = createTRPCRouter({
  /**
   * Start a new execution
   */
  start: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().min(1, 'Workflow ID is required'),
        mode: z.enum(['MANUAL', 'WEBHOOK', 'SCHEDULE', 'TEST']).default('MANUAL'),
        triggerData: z.unknown().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await startExecutionUseCase.execute({
        workflowId: input.workflowId,
        userId: ctx.userId!,
        mode: input.mode as ExecutionMode,
        triggerData: input.triggerData,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    }),

  /**
   * Complete an execution
   */
  complete: protectedProcedure
    .input(
      z.object({
        executionId: z.string().min(1, 'Execution ID is required'),
        nodeResults: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await completeExecutionUseCase.execute({
        executionId: input.executionId,
        nodeResults: input.nodeResults,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    }),

  /**
   * Mark execution as failed
   */
  fail: protectedProcedure
    .input(
      z.object({
        executionId: z.string().min(1, 'Execution ID is required'),
        error: z.string().min(1, 'Error message is required'),
        errorStack: z.string().optional(),
        nodeResults: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await failExecutionUseCase.execute({
        executionId: input.executionId,
        error: input.error,
        errorStack: input.errorStack,
        nodeResults: input.nodeResults,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    }),

  /**
   * Get executions with filters and pagination
   */
  getList: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
        status: z.enum(['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELLED']).optional(),
        mode: z.enum(['MANUAL', 'WEBHOOK', 'SCHEDULE', 'TEST']).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      const result = await getExecutionsUseCase.execute({
        workflowId: input.workflowId,
        userId: ctx.userId!,
        status: input.status as ExecutionStatus | undefined,
        mode: input.mode as ExecutionMode | undefined,
        startDate: input.startDate,
        endDate: input.endDate,
        page: input.page,
        limit: input.limit,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    }),

  /**
   * Get execution details by ID
   */
  getById: protectedProcedure
    .input(
      z.object({
        executionId: z.string().min(1, 'Execution ID is required'),
      })
    )
    .query(async ({ input, ctx }) => {
      const result = await getExecutionDetailsUseCase.execute({
        executionId: input.executionId,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    }),

  /**
   * Get executions for a specific workflow
   */
  getByWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().min(1, 'Workflow ID is required'),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      const result = await getExecutionsUseCase.execute({
        workflowId: input.workflowId,
        userId: ctx.userId!,
        page: input.page,
        limit: input.limit,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    }),
});
