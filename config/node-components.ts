import { HttpRequestNode } from '@/modules/execuation';
import InitialNode from '@/components/initial-node';
import { ManualTrigger } from '@/modules/triggers';
import { NodeType } from '@/prisma/generated/prisma/enums';
import { NodeTypes } from '@xyflow/react';

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTrigger,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
