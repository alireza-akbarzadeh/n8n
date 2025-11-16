import { NodeToolbar, Position } from '@xyflow/react';
import * as React from 'react';
import { Button } from './ui/button';
import { SettingsIcon, TrashIcon } from 'lucide-react';

interface WorkflowNodeProps {
  children: React.ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSetting?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode(props: WorkflowNodeProps) {
  const {
    showToolbar = true,
    children,
    description,
    name,
    onDelete,
    onSetting,
  } = props;
  return (
    <div className="relative">
      {showToolbar && (
        <NodeToolbar>
          <Button size="sm" variant="ghost" onClick={onSetting}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}

      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px] text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-muted-foreground truncate text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </div>
  );
}
