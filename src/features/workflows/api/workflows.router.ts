import { createTRPCRouter, premiumProcedure, protectedProcedure } from '@/trpc/init';
import { baseQuerySchema, editorSchema } from '@/trpc/schemas';
import { HTTP_STATUS } from '@/core/config/constants';
import { ok } from '@/lib/utils';
import { generateSlug } from 'random-word-slugs';
import z from 'zod';

// Use Cases
import {
  CreateWorkflowUseCase,
  GetWorkflowUseCase,
  ListWorkflowsUseCase,
  UpdateWorkflowUseCase,
  UpdateWorkflowNameUseCase,
  DeleteWorkflowUseCase,
} from '../application/use-cases';

// Repository
import { PrismaWorkflowRepository } from '../infrastructure/repositories/prisma-workflow.repository';

// Audit
import { auditWorkflowCreate, auditWorkflowUpdate, auditWorkflowDelete } from '@/lib/audit';

/**
 * Workflows Router (New Architecture)
 *
 * Uses Clean Architecture with use cases
 */
export const workflowsRouter = createTRPCRouter({
  /**
   * Get many workflows with pagination
   */
  getMany: protectedProcedure.input(baseQuerySchema).query(async ({ ctx, input }) => {
    const { page, pageSize, search } = input;

    const repository = new PrismaWorkflowRepository();
    const useCase = new ListWorkflowsUseCase(repository);

    const result = await useCase.execute({
      userId: ctx.userId!,
      page,
      pageSize,
      search,
      requestId: ctx.requestId,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data: items, meta } = result.data;

    return ok({
      data: {
        items,
        totalCount: meta.totalCount,
        hasPaginate: meta.totalCount > 0,
        totalPages: meta.totalPages,
        hasNextPage: meta.hasNextPage,
        hasPreviousPage: meta.hasPreviousPage,
        page: meta.page,
        pageSize: meta.pageSize,
        search,
      },
      message: 'Workflow retrieved successfully',
    });
  }),

  /**
   * Get single workflow by ID
   */
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { id } = input;

    const repository = new PrismaWorkflowRepository();
    const useCase = new GetWorkflowUseCase(repository);

    const result = await useCase.execute({
      id,
      userId: ctx.userId!,
      requestId: ctx.requestId,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return ok({
      data: result.data,
      message: 'Workflow retrieved successfully',
    });
  }),

  /**
   * Create new workflow
   */
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflowName = generateSlug(4);

    const repository = new PrismaWorkflowRepository();
    const useCase = new CreateWorkflowUseCase(repository);

    const result = await useCase.execute({
      name: workflowName,
      userId: ctx.userId!,
      requestId: ctx.requestId,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    // Create audit log for workflow creation
    await auditWorkflowCreate(result.data.id, ctx.userId!, {
      workflowName: result.data.name,
      initialNodeType: 'INITIAL',
      requestId: ctx.requestId,
    });

    return ok({
      data: result.data,
      message: `Workflow ${result.data.name} created successfully`,
      code: HTTP_STATUS.CREATED,
    });
  }),

  /**
   * Delete workflow
   */
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const repository = new PrismaWorkflowRepository();
      const useCase = new DeleteWorkflowUseCase(repository);

      const result = await useCase.execute({
        id,
        userId: ctx.userId!,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Create audit log for workflow deletion
      await auditWorkflowDelete(result.data.id, ctx.userId!, {
        workflowName: result.data.name,
        requestId: ctx.requestId,
      });

      return ok({
        data: result.data,
        message: 'Workflow deleted successfully',
      });
    }),

  /**
   * Update workflow name
   */
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(2).max(100) }))
    .mutation(async ({ input, ctx }) => {
      const { id, name } = input;

      const repository = new PrismaWorkflowRepository();
      const useCase = new UpdateWorkflowNameUseCase(repository);

      const result = await useCase.execute({
        id,
        userId: ctx.userId!,
        name,
        requestId: ctx.requestId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Create audit log for workflow name update
      await auditWorkflowUpdate(result.data.id, ctx.userId!, {
        action: 'name_update',
        newName: name,
        requestId: ctx.requestId,
      });

      return ok({
        data: result.data,
        message: `${name} updated successfully`,
      });
    }),

  /**
   * Update workflow structure (nodes and edges)
   */
  update: protectedProcedure.input(editorSchema).mutation(async ({ input, ctx }) => {
    const { id, edges, nodes } = input;

    const repository = new PrismaWorkflowRepository();
    const useCase = new UpdateWorkflowUseCase(repository);

    const result = await useCase.execute({
      id,
      userId: ctx.userId!,
      nodes,
      edges,
      requestId: ctx.requestId,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    // Create audit log for workflow structure update
    await auditWorkflowUpdate(result.data.id, ctx.userId!, {
      action: 'structure_update',
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodeTypes: [...new Set(nodes.map((n) => n.type))],
      requestId: ctx.requestId,
    });

    return ok({
      data: result.data,
      message: `workflow ${result.data.name} saved successfully`,
    });
  }),
});
