import { IWorkflowRepository } from '../../domain/repositories/workflow.repository.interface';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';
import { inngest } from '@/core/inngest/client';

export interface ExecuteWorkflowInput {
  id: string;
  userId: string;
  requestId?: string;
}

export interface ExecuteWorkflowOutput {
  id: string;
  name: string;
  executionId: string;
  status: 'queued';
}

/**
 * Execute Workflow Use Case
 *
 * Triggers workflow execution via Inngest
 */
export class ExecuteWorkflowUseCase {
  constructor(private readonly workflowRepository: IWorkflowRepository) {}

  async execute(input: ExecuteWorkflowInput): Promise<Result<ExecuteWorkflowOutput, string>> {
    const { id, userId, requestId } = input;

    logger.info(
      {
        requestId,
        userId,
        workflowId: id,
      },
      'Executing workflow'
    );

    try {
      // Step 1: Verify workflow exists and belongs to user
      const workflow = await this.workflowRepository.findById(id, userId);

      if (!workflow) {
        logger.warn(
          {
            requestId,
            userId,
            workflowId: id,
          },
          'Workflow not found for execution'
        );
        return Result.fail('Workflow not found');
      }

      // Step 2: Validate workflow has nodes
      if (workflow.nodes.length === 0) {
        logger.warn(
          {
            requestId,
            userId,
            workflowId: id,
          },
          'Cannot execute empty workflow'
        );
        return Result.fail('Cannot execute workflow with no nodes');
      }

      // Step 3: Send execution event to Inngest
      const { ids } = await inngest.send({
        name: 'workflows/execute.workflow',
        data: {
          workflowId: id,
          userId,
          requestId,
        },
      });

      logger.info(
        {
          requestId,
          userId,
          workflowId: id,
          workflowName: workflow.name,
          executionId: ids[0],
          nodeCount: workflow.nodes.length,
        },
        'Workflow execution queued successfully'
      );

      return Result.ok({
        id: workflow.id.getValue(),
        name: workflow.name,
        executionId: ids[0],
        status: 'queued',
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          workflowId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to execute workflow'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to execute workflow');
    }
  }
}
