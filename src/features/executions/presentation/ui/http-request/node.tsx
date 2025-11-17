'use client';

import { Method } from '@/core/types';
import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import * as React from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { GlobeIcon } from 'lucide-react';
import { NodeStatus } from '@/src/shared/ui/components/react-flow/node-status-Indicator';
import { HttpRequestDialog } from './http-request-dialog';

interface HttpRequestNodeData {
  endpoint?: string;
  body?: string;

  [key: string]: unknown;

  method?: Method;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = React.memo(function (props: NodeProps<HttpRequestNodeType>) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || 'GET'}: ${nodeData.endpoint}`
    : 'Not configured';

  const nodeStatus: NodeStatus = 'error';
  const handleDoubleClick = () => setIsDialogOpen(true);
  const { setNodes } = useReactFlow();

  const handleSubmit = (data: { endpoint: string; method: Method; body?: string }) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              endpoint: data.endpoint,
              method: data.method,
              body: data.body,
            },
          };
        }
        return node;
      })
    );
  };
  return (
    <>
      <HttpRequestDialog
        onSubmit={handleSubmit}
        defaultEndpoint={nodeData.endpoint}
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="HTTP Request"
        icon={GlobeIcon}
        status={nodeStatus}
        description={description}
        onSetting={handleDoubleClick}
        onDoubleClick={handleDoubleClick}
      />
    </>
  );
});

HttpRequestNode.displayName = 'HttpRequestNode';
