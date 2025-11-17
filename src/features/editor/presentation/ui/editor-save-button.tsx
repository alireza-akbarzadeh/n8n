import { Button } from '@/src/shared/ui/components/ui/button';
import { useAtomValue } from 'jotai';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { editorAtom } from '../store/atoms';
import { useUpdateWorkflow } from '@/features/workflows/presentation/hooks/use-workflows';

export function EditorSaveButton({ workflowId }: { workflowId: string }) {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleSave = async () => {
    if (!editor) {
      return;
    }
    const rawNodes = editor.getNodes();
    const rawEdges = editor.getEdges();

    // Clean nodes - remove React Flow internal properties
    const nodes = rawNodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data || {},
    }));

    // Utility to sanitize handle names
    function sanitizeHandleName(name?: string | null) {
      if (!name) return 'main';
      return name.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    // Utility to create a unique key for each edge
    function edgeKey(edge: {
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
    }) {
      return `${edge.source}_${edge.target}_${sanitizeHandleName(edge.sourceHandle)}_${sanitizeHandleName(edge.targetHandle)}`;
    }

    // Clean and deduplicate edges
    const edges = Array.from(
      new Map(
        rawEdges.map((edge) => [
          edgeKey({
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle ?? undefined,
            targetHandle: edge.targetHandle ?? undefined,
          }),
          {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: sanitizeHandleName(edge.sourceHandle),
            targetHandle: sanitizeHandleName(edge.targetHandle),
          },
        ])
      ).values()
    );

    try {
      await saveWorkflow.mutateAsync({
        id: workflowId,
        nodes,
        edges,
      });
      toast.success('Workflow saved successfully');
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Failed to save workflow';
      toast.error(message);
    }
  };

  return (
    <div className="ml-auto">
      <Button isLoading={saveWorkflow.isPending} size="sm" onClick={handleSave} disabled={false}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
}
