"use client";
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import React from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

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

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search workflows" />;
};

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

export const WorkflowContainer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <EntityContainer header={<WorkflowHeader />} search={<WorkflowSearch />} pagination={<WorkflowPagination />}>
        {children}
      </EntityContainer>
    </>
  );
};
