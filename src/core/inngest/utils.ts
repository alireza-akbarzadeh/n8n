import { Connection, Node as PrismaNode } from '@/prisma/generated/prisma/client';
import toposort from 'toposort';

export const topoLogicalSort = (nodes: PrismaNode[], connections: Connection[]): PrismaNode[] => {
  if (connections.length === 0) return nodes;

  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);
  const connectedNodeIds = new Set();
  for (const connection of connections) {
    connectedNodeIds.add(connection.fromNodeId);
    connectedNodeIds.add(connection.toNodeId);
  }
  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cyclic')) {
      throw new Error('workflow contains a cycle');
    }
    throw error;
  }

  const nodeMap = new Map<string, PrismaNode>(nodes.map((node) => [node.id, node]));
  return sortedNodeIds.map((nodeId) => nodeMap.get(nodeId)!).filter(Boolean);
};
