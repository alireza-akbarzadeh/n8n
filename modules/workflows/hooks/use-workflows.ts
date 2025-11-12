import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
};

export const useWorkflows = () => {
  const trpc = useTRPC();

  return useQuery(trpc.workflows.getMany.queryOptions());
};
