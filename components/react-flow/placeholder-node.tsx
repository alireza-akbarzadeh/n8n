"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type ReactNode } from "react";

import { BaseNode } from "./base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
};

export function PlaceholderNode({ children, onClick }: PlaceholderNodeProps) {
  return (
    <BaseNode
      className="bg-card transition-all w-auto h-auto border-dashed border-gray-400 p-4 cursor-pointer hover:border-gray-500 hover:bg-gray-50 text-center text-gray-400 shadow-none"
      onClick={onClick}
    >
      {children}
      <Handle type="target" style={{ visibility: "hidden" }} position={Position.Top} isConnectable={false} />
      <Handle type="source" style={{ visibility: "hidden" }} position={Position.Bottom} isConnectable={false} />
    </BaseNode>
  );
}
