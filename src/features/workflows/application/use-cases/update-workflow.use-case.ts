import { IWorkflowRepository } from '../../domain/repositories/workflow.repository.interface';
import { Node, NodeType, Position } from '../../domain/entities/node.entity';
import { Edge } from '../../domain/entities/edge.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface UpdateWorkflowNodeInput {
  id: string;
  type?: string | null;
  position: { x: number; y: number };
  data?: Record<string, unknown>;
}

export interface UpdateWorkflowEdgeInput {
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface UpdateWorkflowInput {
  id: string;
  userId: string;
  nodes: UpdateWorkflowNodeInput[];
  edges: UpdateWorkflowEdgeInput[];
  requestId?: string;
}

export interface UpdateWorkflowOutput {
  id: string;
  name: string;
  updatedAt: Date;
}

/**
 * Update Workflow Use Case
 *
 * Updates workflow structure (nodes and edges)
 */
export class UpdateWorkflowUseCase {
  constructor(private readonly workflowRepository: IWorkflowRepository) {}

  async execute(input: UpdateWorkflowInput): Promise<Result<UpdateWorkflowOutput, string>> {
    const { id, userId, nodes: inputNodes, edges: inputEdges, requestId } = input;

    logger.info(
      {
        requestId,
        userId,
        workflowId: id,
        nodeCount: inputNodes.length,
        edgeCount: inputEdges.length,
      },
      'Updating workflow structure'
    );

    try {
      // Fetch existing workflow
      const workflow = await this.workflowRepository.findById(id, userId);

      if (!workflow) {
        logger.warn(
          {
            requestId,
            userId,
            workflowId: id,
          },
          'Workflow not found'
        );
        return Result.fail('Workflow not found');
      }

      // Convert input nodes to domain nodes
      const nodes: Node[] = [];
      for (const inputNode of inputNodes) {
        const nodeResult = Node.create(
          {
            name: inputNode.type || 'unknown',
            type: (inputNode.type as NodeType) || NodeType.INITIAL,
            workflowId: id,
            position: inputNode.position as Position,
            data: inputNode.data || {},
          },
          ID.create(inputNode.id)
        );

        if (!nodeResult.success) {
          logger.error(
            {
              requestId,
              userId,
              workflowId: id,
              nodeId: inputNode.id,
              error: nodeResult.error,
            },
            'Failed to create node entity'
          );
          return Result.fail(`Failed to create node: ${nodeResult.error}`);
        }

        nodes.push(nodeResult.data);
      }

      // Convert input edges to domain edges
      const edges: Edge[] = [];
      for (const inputEdge of inputEdges) {
        const edgeResult = Edge.create({
          workflowId: id,
          sourceNodeId: inputEdge.source,
          targetNodeId: inputEdge.target,
          sourceHandle: inputEdge.sourceHandle || 'main',
          targetHandle: inputEdge.targetHandle || 'main',
        });

        if (!edgeResult.success) {
          logger.error(
            {
              requestId,
              userId,
              workflowId: id,
              error: edgeResult.error,
            },
            'Failed to create edge entity'
          );
          return Result.fail(`Failed to create edge: ${edgeResult.error}`);
        }

        edges.push(edgeResult.data);
      }

      // Update workflow with new nodes and edges
      const updateResult = workflow.updateNodesAndEdges(nodes, edges);
      if (!updateResult.success) {
        logger.error(
          {
            requestId,
            userId,
            workflowId: id,
            error: updateResult.error,
          },
          'Failed to update workflow structure'
        );
        return Result.fail(updateResult.error);
      }

      // Persist changes
      const updatedWorkflow = await this.workflowRepository.update(workflow);

      logger.info(
        {
          requestId,
          userId,
          workflowId: updatedWorkflow.id.getValue(),
          workflowName: updatedWorkflow.name,
          nodeCount: nodes.length,
          edgeCount: edges.length,
        },
        'Workflow structure updated successfully'
      );

      return Result.ok({
        id: updatedWorkflow.id.getValue(),
        name: updatedWorkflow.name,
        updatedAt: updatedWorkflow.updatedAt,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          workflowId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to update workflow'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to update workflow');
    }
  }
}
