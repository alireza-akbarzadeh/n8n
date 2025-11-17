import { IWorkflowRepository } from '../../domain/repositories/workflow.repository.interface';
import { Workflow } from '../../domain/entities/workflow.entity';
import { Node, NodeType } from '../../domain/entities/node.entity';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface CreateWorkflowInput {
  name: string;
  userId: string;
  requestId?: string;
}

export interface CreateWorkflowOutput {
  id: string;
  name: string;
  createdAt: Date;
}

/**
 * Create Workflow Use Case
 *
 * Creates a new workflow with an initial node
 */
export class CreateWorkflowUseCase {
  constructor(private readonly workflowRepository: IWorkflowRepository) {}

  async execute(input: CreateWorkflowInput): Promise<Result<CreateWorkflowOutput, string>> {
    const { name, userId, requestId } = input;

    logger.info(
      {
        requestId,
        userId,
        workflowName: name,
      },
      'Creating new workflow'
    );

    try {
      // Step 1: Create workflow entity (no nodes yet)
      const workflowResult = Workflow.create({
        name,
        userId,
        nodes: [],
        edges: [],
      });

      if (!workflowResult.success) {
        logger.error(
          {
            requestId,
            userId,
            error: workflowResult.error,
          },
          'Failed to create workflow entity'
        );
        return Result.fail(workflowResult.error);
      }

      const workflow = workflowResult.data;

      // Step 2: Create initial node with correct workflowId
      const initialNodeResult = Node.create({
        name: NodeType.INITIAL,
        type: NodeType.INITIAL,
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });

      if (!initialNodeResult.success) {
        logger.error(
          {
            requestId,
            userId,
            error: initialNodeResult.error,
          },
          'Failed to create initial node'
        );
        return Result.fail(initialNodeResult.error);
      }

      // Step 3: Add initial node to workflow
      const addNodeResult = workflow.addNode(initialNodeResult.data);
      if (!addNodeResult.success) {
        logger.error(
          {
            requestId,
            userId,
            error: addNodeResult.error,
          },
          'Failed to add initial node to workflow'
        );
        return Result.fail(addNodeResult.error);
      }

      // Step 4: Persist workflow (with initial node)
      const savedWorkflow = await this.workflowRepository.create(workflow);

      logger.info(
        {
          requestId,
          userId,
          workflowId: savedWorkflow.id.getValue(),
          workflowName: savedWorkflow.name,
        },
        'Workflow created successfully'
      );

      return Result.ok({
        id: savedWorkflow.id.getValue(),
        name: savedWorkflow.name,
        createdAt: savedWorkflow.createdAt,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to create workflow'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to create workflow');
    }
  }
}
