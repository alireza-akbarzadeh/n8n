// New architecture routers
import { workflowsRouter } from '@/features/workflows/api';
import { executionRouter } from '@/features/executions/api';
import { createTRPCRouter } from '../init';
import { exampleRouter } from '@/trpc/routers/example-router';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  execution: executionRouter,
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
