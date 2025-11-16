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

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  descritpion?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSetting?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = React.memo(function (
  props: BaseTriggerNodeProps
) {
  const {
    id,
    icon: Icon,
    name,
    descritpion,
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
      description={descritpion}
      onSetting={onSetting}
      onDelete={handleDelete}
    >
      <NodeStatusIndicator
        className="rounded-l-2xl"
        status={status}
        variant="border"
      >
        <BaseNode
          status={status}
          onDoubleClick={onDoubleClick}
          className="rounded-l-2xl relative group"
        >
          <BaseNodeContent>
            {typeof Icon === 'string' ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
});

BaseTriggerNode.displayName = 'BaseTriggerNodeNode';
