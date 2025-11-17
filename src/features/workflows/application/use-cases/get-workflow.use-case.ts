import { IWorkflowRepository } from '../../domain/repositories/workflow.repository.interface';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';
import { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

export interface GetWorkflowInput {
  id: string;
  userId: string;
  requestId?: string;
}

export interface GetWorkflowOutput {
  id: string;
  name: string;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

/**
 * Get Workflow Use Case
 *
 * Retrieves a workflow by ID and converts to React Flow format
 */
export class GetWorkflowUseCase {
  constructor(private readonly workflowRepository: IWorkflowRepository) {}

  async execute(input: GetWorkflowInput): Promise<Result<GetWorkflowOutput, string>> {
    const { id, userId, requestId } = input;

    logger.debug(
      {
        requestId,
        userId,
        workflowId: id,
      },
      'Fetching workflow details'
    );

    try {
      // Fetch workflow
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

      // Convert to React Flow format
      const nodes: ReactFlowNode[] = workflow.nodes.map((node) => ({
        id: node.id.getValue(),
        type: node.type,
        position: node.position,
        data: node.data,
      }));

      const edges: ReactFlowEdge[] = workflow.edges.map((edge) => ({
        id: edge.id.getValue(),
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      }));

      logger.info(
        {
          requestId,
          userId,
          workflowId: id,
          nodeCount: nodes.length,
          edgeCount: edges.length,
        },
        'Workflow details retrieved'
      );

      return Result.ok({
        id: workflow.id.getValue(),
        name: workflow.name,
        nodes,
        edges,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          workflowId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to get workflow'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to get workflow');
    }
  }
}
