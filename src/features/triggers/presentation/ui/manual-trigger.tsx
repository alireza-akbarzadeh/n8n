import { NodeProps } from '@xyflow/react';
import * as React from 'react';

import { MousePointerIcon } from 'lucide-react';
import { BaseTriggerNode } from './base-trigger-node';
import { ManualTriggerDialog } from './manual-trigger-dialog';
import { NodeStatus } from '@/src/shared/ui/components/react-flow/node-status-Indicator';

export const ManualTrigger = React.memo(function (props: NodeProps) {
  const [open, setOpen] = React.useState(false);
  const handleDoubleClick = () => setOpen(true);
  const status: NodeStatus = 'initial';
  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        onDoubleClick={handleDoubleClick}
        onSetting={handleDoubleClick}
        status={status}
      />
    </>
  );
});

ManualTrigger.displayName = 'ManualTrigger';
