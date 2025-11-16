"use client";

import { NodeType } from "@/prisma/generated/prisma/enums";
import { GlobeIcon, MousePointer } from "lucide-react";
import * as React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manaually",
    description: "Runs the flow on clicking a button.Good for getting started qucikly",
    icon: MousePointer,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUSET,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector(props: NodeSelectorProps) {
  const { children, onOpenChange, open } = props;
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = React.useCallback(
    (selected: NodeTypeOption) => {
      if (selected.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);

        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow.");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitial = nodes.some((node) => node.type === NodeType.INITIAL);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerWidth / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selected.type,
        };
        if (hasInitial) {
          return [newNode];
        }
        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [setNodes, getNodes, screenToFlowPosition, onOpenChange],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>A trigger is a setep that start your workflows.</SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                onClick={() => handleNodeSelect(node)}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof node.icon === "string" ? (
                    <img src={node.icon} alt={node.label} className="size-5 object-contain rounded-sm" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start gap-1 text-left">
                    <span className="font-medium">{node.label}</span>
                    <span className="text-xs text-muted-foreground">{node.description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div>
          {executionNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                onClick={() => handleNodeSelect(node)}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof node.icon === "string" ? (
                    <img src={node.icon} alt={node.label} className="size-5 object-contain rounded-sm" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start gap-1 text-left">
                    <span className="font-medium">{node.label}</span>
                    <span className="text-xs text-muted-foreground">{node.description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
