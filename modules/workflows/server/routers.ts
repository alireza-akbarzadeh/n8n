import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { dbTry, ok } from "@/lib/utils";
import { HTTP_STATUS } from "@/config/constants";
import { baseQuerySchema } from "@/trpc/schemas";
import { NodeType } from "@/prisma/generated/prisma/enums";
import { Edge, Node } from "@xyflow/react";

export const workflowsRouter = createTRPCRouter({
  getMany: protectedProcedure.input(baseQuerySchema).query(async ({ ctx, input }) => {
    const { page, pageSize, search } = input;

    const [items, totalCount] = await Promise.all([
      dbTry(
        () =>
          ctx.db.workflow.findMany({
            where: { userId: ctx.userId, name: { contains: search, mode: "insensitive" } },
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
        "Failed to get workflow",
        "BAD_REQUEST",
      ),
      ctx.db.workflow.count({
        where: { userId: ctx.userId, name: { contains: search, mode: "insensitive" } },
      }),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

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
      message: "Workflow retrieved successfully",
    });
  }),

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { id } = input;
    const workflow = await dbTry(
      () =>
        ctx.db.workflow.findUniqueOrThrow({
          where: { id, userId: ctx.userId },
          include: { nodes: true, connection: true },
        }),
      "Failed to get workflow",
      "BAD_REQUEST",
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
      srouceHandle: connection.fromOutput,
      targetHandle: connection.toInput,
    }));

    return ok({
      data: { id: workflow.id, name: workflow.name, nodes, edges },
      message: "Workflow retrieved successfully",
    });
  }),

  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflow = await dbTry(
      () =>
        ctx.db.workflow.create({
          data: {
            name: generateSlug(4),
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
      "Failed to create workflow",
      "FORBIDDEN",
    );

    return ok({ data: workflow, message: `Workflow ${workflow.name} created successfully`, code: HTTP_STATUS.CREATED });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(100),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name } = input;

      const workflow = await dbTry(
        () =>
          ctx.db.workflow.update({
            where: { id, userId: ctx.userId },
            data: { name },
          }),
        "Failed to update workflow name",
        "BAD_REQUEST",
      );

      return ok({ data: workflow, message: `${name} updated successfully` });
    }),

  remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const { id } = input;

    const workflow = await dbTry(
      () =>
        ctx.db.workflow.delete({
          where: { id, userId: ctx.userId },
        }),
      "Failed to delete workflow",
      "BAD_REQUEST",
    );
    return ok({ data: workflow, message: "Workflow deleted successfully" });
  }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(2).max(100) }))
    .mutation(async ({ input, ctx }) => {
      const { id, name } = input;

      const workflow = await dbTry(
        () =>
          ctx.db.workflow.update({
            where: { id, userId: ctx.userId },
            data: { name },
          }),
        "Failed to update workflow",
        "BAD_REQUEST",
      );

      return ok({ data: workflow, message: `${input.name} updated successfully` });
    }),
});
