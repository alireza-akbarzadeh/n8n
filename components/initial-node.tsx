import * as React from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { WorkflowNode } from "./workflow-node";

export default function InitialNode(props: NodeProps) {
  return (
    <WorkflowNode showToolbar>
      <PlaceholderNode {...props}>
        <div className="flex cursor-pointer items-center justify-center">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
}
