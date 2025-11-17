import { workflowsRouter } from '@/modules/workflows';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
});

export type AppRouter = typeof appRouter;
