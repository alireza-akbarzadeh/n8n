import { EnityItem } from '@/components/entities/entity-item';
import { Workflow } from '@/prisma/generated/prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { WorkflowIcon } from 'lucide-react';
import { useRemoveWorkflow } from '../hooks/use-workflows';

export const WorkflowItem = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();
  const handleRemoveWorkflow = () => {
    removeWorkflow.mutate({ id: data.id });
  };
  return (
    <EnityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })} Todo &bull; Create{' '}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <>
          <div className="flex size-8 items-center justify-center">
            <WorkflowIcon className="size-5" />
          </div>
        </>
      }
      onRemove={handleRemoveWorkflow}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
