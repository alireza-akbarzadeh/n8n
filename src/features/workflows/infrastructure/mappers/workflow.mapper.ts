import type {
  Workflow as PrismaWorkflow,
  Node as PrismaNode,
  Connection,
} from '@/prisma/generated/prisma/client';
import type { Prisma } from '@/prisma/generated/prisma/client';
import { Workflow } from '../../domain/entities/workflow.entity';
import { Node, NodeType, Position } from '../../domain/entities/node.entity';
import { Edge } from '../../domain/entities/edge.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';

/**
 * Workflow Mapper
 *
 * Maps between domain entities and Prisma models
 */
export class WorkflowMapper {
  /**
   * Map Prisma model to domain entity
   */
  static toDomain(
    prismaWorkflow: PrismaWorkflow & {
      nodes: PrismaNode[];
      connection: Connection[];
    }
  ): Workflow {
    // Map nodes
    const nodes = prismaWorkflow.nodes.map((prismaNode: PrismaNode) => {
      const nodeResult = Node.create(
        {
          name: prismaNode.name,
          type: prismaNode.type as NodeType,
          workflowId: prismaNode.workflowId,
          position: prismaNode.position as Position,
          data: (prismaNode.data as Record<string, unknown>) || {},
          createdAt: prismaNode.createdAt,
          updatedAt: prismaNode.updatedAt,
        },
        ID.create(prismaNode.id)
      );

      if (!nodeResult.success) {
        throw new Error(`Failed to create node: ${nodeResult.error}`);
      }

      return nodeResult.data;
    });

    // Map edges
    const edges = prismaWorkflow.connection.map((connection: Connection) => {
      const edgeResult = Edge.create(
        {
          workflowId: connection.workflowId,
          sourceNodeId: connection.fromNodeId,
          targetNodeId: connection.toNodeId,
          sourceHandle: connection.fromOutput,
          targetHandle: connection.toInput,
          createdAt: connection.createdAt,
          updatedAt: connection.updatedAt,
        },
        ID.create(connection.id)
      );

      if (!edgeResult.success) {
        throw new Error(`Failed to create edge: ${edgeResult.error}`);
      }

      return edgeResult.data;
    });

    // Create workflow
    const workflowResult = Workflow.create(
      {
        name: prismaWorkflow.name,
        userId: prismaWorkflow.userId,
        nodes,
        edges,
        createdAt: prismaWorkflow.createdAt,
        updatedAt: prismaWorkflow.updatedAt,
      },
      ID.create(prismaWorkflow.id)
    );

    if (!workflowResult.success) {
      throw new Error(`Failed to create workflow: ${workflowResult.error}`);
    }

    return workflowResult.data;
  }

  /**
   * Map domain entity to Prisma create input
   */
  static toPrismaCreate(workflow: Workflow): {
    id: string;
    name: string;
    userId: string;
    nodes: {
      create: Array<{
        id: string;
        name: string;
        type: NodeType;
        position: Position;
        data: Prisma.InputJsonValue;
      }>;
    };
    connection: {
      create: Array<{
        id: string;
        fromNodeId: string;
        toNodeId: string;
        fromOutput: string;
        toInput: string;
      }>;
    };
  } {
    return {
      id: workflow.id.getValue(),
      name: workflow.name,
      userId: workflow.userId,
      nodes: {
        create: workflow.nodes.map((node) => ({
          id: node.id.getValue(),
          name: node.name,
          type: node.type,
          position: node.position,
          data: node.data as Prisma.InputJsonValue,
        })),
      },
      connection: {
        create: workflow.edges.map((edge) => ({
          id: edge.id.getValue(),
          fromNodeId: edge.sourceNodeId,
          toNodeId: edge.targetNodeId,
          fromOutput: edge.sourceHandle,
          toInput: edge.targetHandle,
        })),
      },
    };
  }

  /**
   * Map domain entity to Prisma update input
   */
  static toPrismaUpdate(workflow: Workflow): {
    name: string;
    updatedAt: Date;
  } {
    return {
      name: workflow.name,
      updatedAt: workflow.updatedAt,
    };
  }

  /**
   * Convert nodes and edges for bulk update
   */
  static toPrismaBulkUpdate(workflow: Workflow): {
    nodes: Array<{
      id: string;
      name: string;
      type: NodeType;
      position: Position;
      data: Record<string, unknown>;
    }>;
    connections: Array<{
      id: string;
      fromNodeId: string;
      toNodeId: string;
      fromOutput: string;
      toInput: string;
    }>;
  } {
    return {
      nodes: workflow.nodes.map((node) => ({
        id: node.id.getValue(),
        name: node.name,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      connections: workflow.edges.map((edge) => ({
        id: edge.id.getValue(),
        fromNodeId: edge.sourceNodeId,
        toNodeId: edge.targetNodeId,
        fromOutput: edge.sourceHandle,
        toInput: edge.targetHandle,
      })),
    };
  }
}
