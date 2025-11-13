"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import React from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export function Workflows() {
  const Workflows = useSuspenseWorkflows();

  return <div className="flex-1 justify-center items-center flex">{JSON.stringify(Workflows.data.data, null, 2)}</div>;
}

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
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
      <EntityHeader
        title="workflows"
        description="Create and manage your workflows"
        onNew={onCreateWorkflow}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowContainer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <EntityContainer header={<WorkflowHeader />} search={<></>} pagination={<></>}>
        {children}
      </EntityContainer>
    </>
  );
};
