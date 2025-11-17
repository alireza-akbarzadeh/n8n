import { workflowsRouter } from '@/modules/workflows';
import { createTRPCRouter } from '../init';
import { exampleRouter } from '@/trpc/routers/example-router';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
