import { trpc, prefetch } from '@/trpc/server';
import type { inferInput } from '@trpc/tanstack-react-query';

type WorkflowsInput = inferInput<typeof trpc.workflows.getMany>;
// type WorkflowsOutput = inferOutput<typeof trpc.workflows.getMany>;

export const prefetchWorflows = (params: WorkflowsInput) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

export const prefetchWorflow = (id: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
