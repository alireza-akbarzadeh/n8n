"use client";

import { useSuspenseWorkflow } from "@/modules/workflows/hooks/use-workflows";
import * as React from "react";
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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { nodeComponnets } from "@/config/node-components";

export function Editor({ workflowId }: { workflowId: string }) {
  const { data } = useSuspenseWorkflow(workflowId);

  const [nodes, setNodes] = React.useState<Node[]>(data.data.nodes);
  const [edges, setEdges] = React.useState<Edge[]>(data.data.edges);

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = React.useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponnets}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
