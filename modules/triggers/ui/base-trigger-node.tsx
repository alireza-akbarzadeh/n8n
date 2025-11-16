import { NodeProps, Position } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import * as React from "react";
import { WorkflowNode } from "@/components/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  descritpion?: string;
  children?: ReactNode;
  onSetting?: () => void;
  onDubbleClick?: () => void;
}

export const BaseTriggerNode = React.memo(function (props: BaseTriggerNodeProps) {
  const { id, icon: Icon, name, descritpion, children, onSetting, onDubbleClick } = props;
  // TODO: Add delete
  const handleDelete = () => {};
  return (
    <WorkflowNode name={name} description={descritpion} onSetting={onSetting} onDelete={handleDelete}>
      {/*TOOD: wrap it with an indicator */}
      <BaseNode onDoubleClick={onDubbleClick} className="rounded-2xl relative group">
        <BaseNodeContent>
          {typeof Icon === "string" ? (
            <Image src={Icon} alt={name} width={16} height={16} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}
          {children}
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
});

BaseTriggerNode.displayName = "BaseTriggerNodeNode";
