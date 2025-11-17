import { IWorkflowRepository } from '../../domain/repositories/workflow.repository.interface';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface DeleteWorkflowInput {
  id: string;
  userId: string;
  requestId?: string;
}

export interface DeleteWorkflowOutput {
  id: string;
  name: string;
}

/**
 * Delete Workflow Use Case
 *
 * Deletes a workflow
 */
export class DeleteWorkflowUseCase {
  constructor(private readonly workflowRepository: IWorkflowRepository) {}

  async execute(input: DeleteWorkflowInput): Promise<Result<DeleteWorkflowOutput, string>> {
    const { id, userId, requestId } = input;

    logger.warn(
      {
        requestId,
        userId,
        workflowId: id,
      },
      'Deleting workflow'
    );

    try {
      // Fetch workflow first to get the name
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

      // Delete workflow
      await this.workflowRepository.delete(id, userId);

      logger.info(
        {
          requestId,
          userId,
          workflowId: id,
          workflowName: workflow.name,
        },
        'Workflow deleted successfully'
      );

      return Result.ok({
        id: workflow.id.getValue(),
        name: workflow.name,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          workflowId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to delete workflow'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to delete workflow');
    }
  }
}
