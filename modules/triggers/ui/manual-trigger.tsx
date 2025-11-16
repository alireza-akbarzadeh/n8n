import { NodeProps, Position } from "@xyflow/react";
import * as React from "react";

import { MousePointerIcon, type LucideIcon } from "lucide-react";
import { BaseTriggerNode } from "./base-trigger-node";

export const ManualTrigger = React.memo(function (props: NodeProps) {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        onDubbleClick={() => {}}
        onSetting={() => {}}
      />
    </>
  );
});

ManualTrigger.displayName = "ManualTrigger";
