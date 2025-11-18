import { IExecutionRepository } from '../../domain/repositories/execution.repository.interface';
import { ExecutionNodeResults } from '../../domain/entities/execution.entity';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure';

export interface CompleteExecutionInput {
  executionId: string;
  nodeResults?: ExecutionNodeResults;
  requestId?: string;
}

export interface CompleteExecutionOutput {
  executionId: string;
  duration: number;
  completedAt: Date;
}

export class CompleteExecutionUseCase {
  constructor(private readonly executionRepository: IExecutionRepository) {}

  async execute(input: CompleteExecutionInput): Promise<Result<CompleteExecutionOutput, string>> {
    try {
      logger.debug(
        {
          requestId: input.requestId,
          executionId: input.executionId,
        },
        'Completing execution'
      );

      // Find execution
      const execution = await this.executionRepository.findById(input.executionId);

      if (!execution) {
        logger.warn(
          {
            requestId: input.requestId,
            executionId: input.executionId,
          },
          'Execution not found'
        );
        return Result.fail('Execution not found');
      }

      // Complete execution
      try {
        execution.complete(input.nodeResults);
      } catch (error) {
        logger.warn(
          {
            requestId: input.requestId,
            executionId: input.executionId,
            error,
          },
          'Failed to complete execution: invalid state'
        );
        return Result.fail(error instanceof Error ? error.message : 'Failed to complete execution');
      }

      // Save updated execution
      const updatedExecution = await this.executionRepository.update(execution);

      logger.info(
        {
          requestId: input.requestId,
          executionId: updatedExecution.id.getValue(),
          duration: updatedExecution.duration,
        },
        'Execution completed successfully'
      );

      return Result.ok({
        executionId: updatedExecution.id.getValue(),
        duration: updatedExecution.duration!,
        completedAt: updatedExecution.finishedAt!,
      });
    } catch (error) {
      logger.error(
        {
          requestId: input.requestId,
          executionId: input.executionId,
          error,
        },
        'Failed to complete execution'
      );
      return Result.fail('Failed to complete execution');
    }
  }
}
