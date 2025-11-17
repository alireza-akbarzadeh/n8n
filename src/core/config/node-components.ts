import { HttpRequestNode } from '@/features/executions/presentation';
import InitialNode from '@/components/initial-node';
import { ManualTrigger } from '@/features/triggers/presentation';
import { NodeType } from '@/prisma/generated/prisma/enums';
import { NodeTypes } from '@xyflow/react';

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTrigger,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
