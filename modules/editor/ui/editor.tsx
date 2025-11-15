"use client";

import { ErrorView, LoadingView } from "@/components/entities/entity-states";
import { useSuspenseWorkflow } from "@/modules/workflows/hooks/use-workflows";

export function EditorLoading() {
  return <LoadingView message="Error loading editor" />;
}

export function EditorError() {
  return <ErrorView message="loading editor...." />;
}
export function Editor({ workflowId }: { workflowId: string }) {
  const { data } = useSuspenseWorkflow(workflowId);
  return <p>{JSON.stringify(data?.data, null, 2)}</p>;
}
