'use client';
import { Button } from '@/components/ui/button';
import { FlaskConicalIcon } from 'lucide-react';

export function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
  return (
    <Button size="lg" onClick={() => {}} disabled={false}>
      <FlaskConicalIcon className="mr-2 h-4 w-4" />
      Execute Workflow
    </Button>
  );
}
