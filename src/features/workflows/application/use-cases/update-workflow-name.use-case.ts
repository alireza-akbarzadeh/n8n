import { IWorkflowRepository } from '../../domain/repositories/workflow.repository.interface';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface UpdateWorkflowNameInput {
  id: string;
  userId: string;
  name: string;
  requestId?: string;
}

export interface UpdateWorkflowNameOutput {
  id: string;
  name: string;
  updatedAt: Date;
}

/**
 * Update Workflow Name Use Case
 *
 * Updates the name of a workflow
 */
export class UpdateWorkflowNameUseCase {
  constructor(private readonly workflowRepository: IWorkflowRepository) {}

  async execute(input: UpdateWorkflowNameInput): Promise<Result<UpdateWorkflowNameOutput, string>> {
    const { id, userId, name, requestId } = input;

    logger.debug(
      {
        requestId,
        userId,
        workflowId: id,
        newName: name,
      },
      'Updating workflow name'
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

      // Update name
      const updateResult = workflow.updateName(name);
      if (!updateResult.success) {
        logger.error(
          {
            requestId,
            userId,
            workflowId: id,
            error: updateResult.error,
          },
          'Failed to update workflow name'
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
          newName: name,
        },
        'Workflow name updated successfully'
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
        'Failed to update workflow name'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to update workflow name');
    }
  }
}
