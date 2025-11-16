import InitialNode from "@/components/initial-node";
import { NodeType } from "@/prisma/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";

export const nodeComponnets = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisterdNodeType = keyof typeof nodeComponnets;
