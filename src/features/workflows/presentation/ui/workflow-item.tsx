import { EnityItem } from '@/src/shared/ui/components/entities/entity-item';
import { formatDistanceToNow } from 'date-fns';
import { WorkflowIcon } from 'lucide-react';
import { useRemoveWorkflow } from '../hooks/use-workflows';

type WorkflowItemData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export const WorkflowItem = ({ data }: { data: WorkflowItemData }) => {
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
