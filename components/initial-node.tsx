import * as React from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export default function InitialNode(props: NodeProps) {
  const [selectorOpen, setSelectorOpen] = React.useState<boolean>(false);

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode>
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
          <div className="flex cursor-pointer items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
}
