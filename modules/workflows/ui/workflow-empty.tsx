"use client";
import { EmptyView } from "@/components/entities/entity-view";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/router";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useSuspenseWorkflows, useCreateWorkflow } from "../hooks/use-workflows";

export const WorkflowEmpty = () => {
  const router = useRouter();
  const [params] = useWorkflowParams();
  const workflow = useSuspenseWorkflows();
  const { handleError, modal } = useUpgradeModal();
  const createWorkflow = useCreateWorkflow();

  const onCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.data?.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      {workflow.data.data?.totalCount === 0 && (
        <EmptyView
          onNew={onCreateWorkflow}
          message={
            params.search.length > 0
              ? `No workflows found matching "${params.search}". Try searching with a different name.`
              : "You haven’t created any workflows yet. Get started by creating your first workflow!"
          }
        />
      )}
    </>
  );
};
