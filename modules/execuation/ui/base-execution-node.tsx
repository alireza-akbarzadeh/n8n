import { NodeProps, Position, useReactFlow } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import * as React from 'react';
import { WorkflowNode } from '@/components/workflow-node';
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node';
import Image from 'next/image';
import { BaseHandle } from '@/components/react-flow/base-handle';
import {
  NodeStatus,
  NodeStatusIndicator,
} from '@/components/react-flow/node-status-Indicator';

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  onSetting?: () => void;
  onDoubleClick?: () => void;
  status?: NodeStatus;
}

export const BaseExecutionNode = React.memo(function (
  props: BaseExecutionNodeProps
) {
  const {
    id,
    icon: Icon,
    name,
    description,
    children,
    onSetting,
    onDoubleClick,
    status = 'initial',
  } = props;
  const { setNodes, setEdges } = useReactFlow();
  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <WorkflowNode
      name={name}
      description={description}
      onSetting={onSetting}
      onDelete={handleDelete}
    >
      <NodeStatusIndicator status={status} variant="border">
        <BaseNode status={status} onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon === 'string' ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="traget-1" type="target" position={Position.Left} />
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
});

BaseExecutionNode.displayName = 'BaseExecutionNode';
