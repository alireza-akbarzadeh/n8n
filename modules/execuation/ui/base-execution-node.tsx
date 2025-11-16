import { NodeProps, Position } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import * as React from 'react';
import { WorkflowNode } from '@/components/workflow-node';
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node';
import Image from 'next/image';
import { BaseHandle } from '@/components/react-flow/base-handle';

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  descritpion?: string;
  children?: ReactNode;
  onSetting?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = React.memo(function (
  props: BaseExecutionNodeProps
) {
  const {
    id,
    icon: Icon,
    name,
    descritpion,
    children,
    onSetting,
    onDoubleClick,
  } = props;
  // TODO: Add delete
  const handleDelete = () => {};
  return (
    <WorkflowNode
      name={name}
      description={descritpion}
      onSetting={onSetting}
      onDelete={handleDelete}
    >
      <BaseNode onDoubleClick={onDoubleClick}>
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
    </WorkflowNode>
  );
});

BaseExecutionNode.displayName = 'BaseExecutionNode';
