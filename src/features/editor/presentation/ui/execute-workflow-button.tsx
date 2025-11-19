'use client';
import { Button } from '@/components/ui/button';
import { useExecuteWorkflow } from '@/features/workflows/presentation/hooks/use-workflows';
import { FlaskConicalIcon } from 'lucide-react';

export function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
  const exceuteWorkflow = useExecuteWorkflow();
  const handleExcute = () => {
    exceuteWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button size="lg" onClick={handleExcute} disabled={exceuteWorkflow.isPending}>
      <FlaskConicalIcon className="mr-2 h-4 w-4" />
      Execute Workflow
    </Button>
  );
}
