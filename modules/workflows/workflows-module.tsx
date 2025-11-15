"use client";

import { useSuspenseWorkflows } from "./hooks/use-workflows";
import { WorkflowEmpty } from "./ui/workflow-empty";
import { WorkflowItem } from "./ui/workflow-item";
import { EntityList } from "./ui/workflow-list";

export function WorkflowModule() {
  const workflows = useSuspenseWorkflows();
  return (
    <EntityList
      emptyView={<WorkflowEmpty />}
      items={workflows.data.data?.items || []}
      renderItem={(item) => <WorkflowItem data={item} />}
      getKey={(workflow) => workflow.id}
    />
  );
}
