import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { dbTry, ok } from "@/lib/utils";
import { HTTP_STATUS } from "@/lib/constants";

const getMant = z.object({
  search: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
});

export const workflowsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const workflow = await dbTry(
      () => ctx.db.workflow.findMany({ where: { userId: ctx.userId } }),
      "Failed to get workflow",
      "BAD_REQUEST",
    );
    return ok({ data: workflow, message: "Workflow retrieved successfully" });
  }),

  getOne: protectedProcedure.input(z.object({ id: z.uuid() })).query(async ({ input, ctx }) => {
    const { id } = input;

    const workflow = await dbTry(
      () =>
        ctx.db.workflow.findUnique({
          where: { id, userId: ctx.userId },
        }),
      "Failed to get workflow",
      "BAD_REQUEST",
    );

    return ok({ data: workflow, message: "Workflow retrieved successfully" });
  }),

  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflow = await dbTry(
      () =>
        ctx.db.workflow.create({
          data: {
            name: generateSlug(4),
            userId: ctx.userId!,
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
        id: z.uuid(),
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
        "Failed to update workflow",
        "BAD_REQUEST",
      );

      return ok({ data: workflow, message: "Workflow updated successfully" });
    }),

  remove: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ input, ctx }) => {
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
    .input(z.object({ id: z.uuid(), name: z.string().min(2).max(100) }))
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
