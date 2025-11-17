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

export function Editor({ workflowId }: { workflowId: string }) {
  const { data } = useSuspenseWorkflow(workflowId);

  // Helper to build a human-readable label from handles
  const buildLabel = React.useCallback(
    (sourceHandle?: string | null, targetHandle?: string | null) => {
      const s = sourceHandle && sourceHandle.length > 0 ? sourceHandle : 'main';
      const t = targetHandle && targetHandle.length > 0 ? targetHandle : 'main';
      return `${s} -> ${t}`;
    },
    []
  );

  const [nodes, setNodes] = React.useState<Node[]>(data.data.nodes);
  const [edges, setEdges] = React.useState<Edge[]>(
    data.data.edges.map((e) => ({
      ...e,
      label: e.label ?? buildLabel(e.sourceHandle, e.targetHandle),
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
            label: buildLabel(params.sourceHandle as string, params.targetHandle as string),
          },
          edgesSnapshot
        )
      ),
    [buildLabel]
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
      </ReactFlow>
    </div>
  );
}
