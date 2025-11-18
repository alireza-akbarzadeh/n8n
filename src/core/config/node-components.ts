import { HttpRequestNode } from '@/features/executions/presentation';
import InitialNode from '@/src/shared/ui/components/initial-node';
import { NodeType } from '@/prisma/generated/prisma/enums';
import { NodeTypes } from '@xyflow/react';
import { ManualTrigger } from '@/src/features/editor/presentation/ui/manual-trigger';

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTrigger,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
