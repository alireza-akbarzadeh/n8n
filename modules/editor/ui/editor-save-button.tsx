import { Button } from '@/components/ui/button';
import { useAtomValue } from 'jotai';
import { SaveIcon } from 'lucide-react';
import { editorAtom } from '../store/atoms';
import { useUpdateWorkflow } from '@/modules/workflows/hooks/use-workflows';

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

    // Clean edges - remove React Flow internal properties
    const edges = rawEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    }));

    console.log('Saving workflow:', { id: workflowId, nodes, edges });

    try {
      await saveWorkflow.mutateAsync({
        id: workflowId,
        nodes,
        edges,
      });
      console.log('Workflow saved successfully');
    } catch (error) {
      console.error('Failed to save workflow:', error);
    }
  };

  return (
    <div className="ml-auto">
      <Button
        isLoading={saveWorkflow.isPending}
        size="sm"
        onClick={handleSave}
        disabled={false}
      >
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
}
