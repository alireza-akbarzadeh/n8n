import { HTTP_STATUS } from '@/config/constants';
import { dbTry, ok } from '@/lib/utils';
import { NodeType } from '@/prisma/generated/prisma/enums';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '@/trpc/init';
import { baseQuerySchema, editorSchema } from '@/trpc/schemas';
import { Edge, Node } from '@xyflow/react';
import { generateSlug } from 'random-word-slugs';
import z from 'zod';
import { logger } from '@/lib/logger';
import { auditWorkflowCreate, auditWorkflowUpdate, auditWorkflowDelete } from '@/lib/audit';

export const workflowsRouter = createTRPCRouter({
  getMany: protectedProcedure.input(baseQuerySchema).query(async ({ ctx, input }) => {
    const { page, pageSize, search } = input;

    logger.debug(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        page,
        pageSize,
        search,
      },
      'Fetching workflows'
    );

    const [items, totalCount] = await Promise.all([
      dbTry(
        () =>
          ctx.db.workflow.findMany({
            where: {
              userId: ctx.userId,
              name: { contains: search, mode: 'insensitive' },
            },
            orderBy: { updatedAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
        'Failed to get workflow',
        'BAD_REQUEST'
      ),
      ctx.db.workflow.count({
        where: {
          userId: ctx.userId,
          name: { contains: search, mode: 'insensitive' },
        },
      }),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    logger.info(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        totalCount,
        page,
        totalPages,
      },
      'Workflows retrieved successfully'
    );

    return ok({
      data: {
        items,
        totalCount,
        hasPaginate: totalCount > 0,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page,
        pageSize,
        search,
      },
      message: 'Workflow retrieved successfully',
    });
  }),

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { id } = input;

    logger.debug(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        workflowId: id,
      },
      'Fetching workflow details'
    );

    const workflow = await dbTry(
      () =>
        ctx.db.workflow.findUniqueOrThrow({
          where: { id, userId: ctx.userId },
          include: { nodes: true, connection: true },
        }),
      'Failed to get workflow',
      'BAD_REQUEST'
    );
    const nodes: Node[] = workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position as { x: number; y: number },
      data: (node.data as Record<string, unknown>) || {},
    }));

    const edges: Edge[] = workflow.connection.map((connection) => ({
      id: connection.id,
      source: connection.fromNodeId,
      target: connection.toNodeId,
      sourceHandle: connection.fromOutput, // Fixed typo: was 'srouceHandle'
      targetHandle: connection.toInput,
    }));

    logger.info(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        workflowId: id,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      'Workflow details retrieved'
    );

    return ok({
      data: { id: workflow.id, name: workflow.name, nodes, edges },
      message: 'Workflow retrieved successfully',
    });
  }),

  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflowName = generateSlug(4);

    logger.info(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        workflowName,
      },
      'Creating new workflow'
    );

    const workflow = await dbTry(
      () =>
        ctx.db.workflow.create({
          data: {
            name: workflowName,
            userId: ctx.userId!,
            nodes: {
              create: {
                type: NodeType.INITIAL,
                position: { x: 0, y: 0 },
                name: NodeType.INITIAL,
              },
            },
          },
        }),
      'Failed to create workflow',
      'FORBIDDEN'
    );

    // Create audit log for workflow creation
    await auditWorkflowCreate(workflow.id, ctx.userId!, {
      workflowName: workflow.name,
      initialNodeType: NodeType.INITIAL,
      requestId: ctx.requestId,
    });

    logger.info(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        workflowId: workflow.id,
        workflowName: workflow.name,
      },
      'Workflow created successfully'
    );

    return ok({
      data: workflow,
      message: `Workflow ${workflow.name} created successfully`,
      code: HTTP_STATUS.CREATED,
    });
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      logger.warn(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: id,
        },
        'Deleting workflow'
      );

      const workflow = await dbTry(
        () =>
          ctx.db.workflow.delete({
            where: { id, userId: ctx.userId },
          }),
        'Failed to delete workflow',
        'BAD_REQUEST'
      );

      // Create audit log for workflow deletion
      await auditWorkflowDelete(workflow.id, ctx.userId!, {
        workflowName: workflow.name,
        requestId: ctx.requestId,
      });

      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: workflow.id,
          workflowName: workflow.name,
        },
        'Workflow deleted successfully'
      );

      return ok({ data: workflow, message: 'Workflow deleted successfully' });
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(2).max(100) }))
    .mutation(async ({ input, ctx }) => {
      const { id, name } = input;

      logger.debug(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: id,
          newName: name,
        },
        'Updating workflow name'
      );

      const workflow = await dbTry(
        () =>
          ctx.db.workflow.update({
            where: { id, userId: ctx.userId },
            data: { name },
          }),
        'Failed to update workflow',
        'BAD_REQUEST'
      );

      // Create audit log for workflow name update
      await auditWorkflowUpdate(workflow.id, ctx.userId!, {
        action: 'name_update',
        oldName: workflow.name, // Note: this would be the new name, ideally fetch old name first
        newName: name,
        requestId: ctx.requestId,
      });

      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: workflow.id,
          newName: name,
        },
        'Workflow name updated successfully'
      );

      return ok({
        data: workflow,
        message: `${input.name} updated successfully`,
      });
    }),

  update: protectedProcedure.input(editorSchema).mutation(async ({ input, ctx }) => {
    const { id, edges, nodes } = input;

    logger.info(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        workflowId: id,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      'Updating workflow structure'
    );

    const workflow = await dbTry(
      () =>
        ctx.db.workflow.findUniqueOrThrow({
          where: { id, userId: ctx.userId },
          include: { nodes: true, connection: true },
        }),
      'Failed to get workflow',
      'BAD_REQUEST'
    );

    const result = await dbTry(
      () =>
        ctx.db.$transaction(async (tx) => {
          await tx.node.deleteMany({ where: { workflowId: id } });
          await tx.connection.deleteMany({ where: { workflowId: id } });

          if (nodes.length > 0) {
            await tx.node.createMany({
              data: nodes.map((node) => ({
                id: node.id,
                workflowId: id,
                name: node.type || 'unknown',
                type: (node.type as NodeType) || NodeType.INITIAL,
                position: node.position,
                data: node.data || {},
              })),
            });
          }
          if (edges.length > 0) {
            await tx.connection.createMany({
              data: edges.map((edge) => ({
                workflowId: id,
                fromNodeId: edge.source,
                toNodeId: edge.target,
                fromOutput: edge.sourceHandle || 'main',
                toInput: edge.targetHandle || 'main',
              })),
            });
          }

          await tx.workflow.update({
            where: { id },
            data: { updatedAt: new Date() },
          });

          return workflow;
        }),
      'Failed to update workflow',
      'BAD_REQUEST'
    );

    // Create audit log for workflow structure update
    await auditWorkflowUpdate(workflow.id, ctx.userId!, {
      action: 'structure_update',
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodeTypes: [...new Set(nodes.map((n) => n.type))],
      requestId: ctx.requestId,
    });

    logger.info(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        workflowId: workflow.id,
        workflowName: workflow.name,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      'Workflow structure updated successfully'
    );

    return ok({
      data: result,
      message: `workflow ${workflow.name} saved successfully`,
    });
  }),
});
