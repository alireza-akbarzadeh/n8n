import { NodeProps } from '@xyflow/react';
import * as React from 'react';

import { MousePointerIcon } from 'lucide-react';
import { BaseTriggerNode } from './base-trigger-node';

export const ManualTrigger = React.memo(function (props: NodeProps) {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        onDoubleClick={() => {}}
        onSetting={() => {}}
      />
    </>
  );
});

ManualTrigger.displayName = 'ManualTrigger';
