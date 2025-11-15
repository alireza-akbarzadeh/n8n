"use client";

import { EntityPagination } from "@/components/entity-components";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useSuspenseWorkflows } from "../hooks/use-workflows";

export const WorkflowPagination = () => {
  const [params, setParams] = useWorkflowParams();
  const { data, isFetching } = useSuspenseWorkflows();

  return (
    <EntityPagination
      page={data.data?.page as number}
      onPageChange={(page) => setParams({ ...params, page })}
      totalPages={data.data?.totalPages as number}
      disabled={isFetching}
    />
  );
};
