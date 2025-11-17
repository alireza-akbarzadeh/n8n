'use client';
import { EntityHeader } from '@/components/entities/entity-header';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';
import { useCreateWorkflow } from '../hooks/use-workflows';

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
