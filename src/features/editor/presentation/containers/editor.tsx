'use client';

import { useSuspenseWorkflow } from '@/features/workflows/presentation/hooks/use-workflows';
import * as React from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { nodeComponents } from '@/config/node-components';
import { AddNodeButton } from '@/components/add-node-button';
import { useSetAtom } from 'jotai';
import { editorAtom } from '../store/atoms';
import { NodeType } from '@/features/workflows/domain/entities';
import { ExecuteWorkflowButton } from '../ui/execute-workflow-button';

export function Editor({ workflowId }: { workflowId: string }) {
  const { data } = useSuspenseWorkflow(workflowId);

  const [nodes, setNodes] = React.useState<Node[]>(data.data.nodes);
  const [edges, setEdges] = React.useState<Edge[]>(
    data.data.edges.map((e) => ({
      ...e,
    }))
  );
  const setEditor = useSetAtom(editorAtom);

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = React.useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) =>
        addEdge(
          {
            ...params,
          },
          edgesSnapshot
        )
      ),
    []
  );
  const hasManularTrigger = React.useMemo(
    () => nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER),
    [nodes]
  );
  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
          style: { stroke: '#b1b1b7', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManularTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
