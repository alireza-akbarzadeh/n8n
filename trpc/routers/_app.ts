import { createTRPCRouter, premiumProcedure, protectedProcedure, publicProcedure } from "../init";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation(async ({ ctx }) => {
    await inngest.send({ name: "execute/ai" });
  }),
  getWorkflow: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({ name: "test/hello.world", data: { email: "devtools@gmail.com" } });
    return { message: "Job queued", success: true };
    // return ctx.db.workflow.create({data: {name: "smoothing"}});
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
