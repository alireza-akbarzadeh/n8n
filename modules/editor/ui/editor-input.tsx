import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeName } from '@/lib/utils';
import {
  useSuspenseWorkflow,
  useUpdateWorkflowName,
} from '@/modules/workflows/hooks/use-workflows';
import React from 'react';

export function EditorNameInput({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(workflow.data.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setName(workflow.data.name);
  }, [workflow.data.name]);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const normalized = normalizeName(name);

    if (normalized === workflow.data.name.trim()) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    try {
      await updateWorkflow.mutateAsync({ id: workflowId, name: normalized });
    } catch {
      setName(workflow.data.name);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') handleSave();
    if (event.key === 'Escape') {
      setName(workflow.data.name);
      setIsEditing(false);
    }
  };

  const inputWidth = Math.max(name.length + 1, 5);

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={name}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onChange={(e) => setName(e.target.value)}
        className="h-7 max-w-[400px] px-2 transition-all"
        style={{
          width: `${inputWidth}ch`,
        }}
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="hover:text-foreground cursor-pointer font-semibold transition-colors"
    >
      {updateWorkflow.isPending ? <Skeleton className="h-5 w-[200px]" /> : workflow.data.name}
    </BreadcrumbItem>
  );
}
