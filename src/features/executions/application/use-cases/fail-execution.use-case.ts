import { IExecutionRepository } from '../../domain/repositories/execution.repository.interface';
import { ExecutionNodeResults } from '../../domain/entities/execution.entity';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface FailExecutionInput {
  executionId: string;
  error: string;
  errorStack?: string;
  nodeResults?: ExecutionNodeResults;
  requestId?: string;
}

export interface FailExecutionOutput {
  executionId: string;
  duration: number;
  failedAt: Date;
  error: string;
}

export class FailExecutionUseCase {
  constructor(private readonly executionRepository: IExecutionRepository) {}

  async execute(input: FailExecutionInput): Promise<Result<FailExecutionOutput, string>> {
    try {
      logger.debug(
        {
          requestId: input.requestId,
          executionId: input.executionId,
        },
        'Failing execution'
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

      // Fail execution
      try {
        execution.fail(input.error, input.errorStack, input.nodeResults);
      } catch (error) {
        logger.warn(
          {
            requestId: input.requestId,
            executionId: input.executionId,
            error,
          },
          'Failed to mark execution as failed: invalid state'
        );
        return Result.fail(
          error instanceof Error ? error.message : 'Failed to mark execution as failed'
        );
      }

      // Save updated execution
      const updatedExecution = await this.executionRepository.update(execution);

      logger.info(
        {
          requestId: input.requestId,
          executionId: updatedExecution.id.getValue(),
          duration: updatedExecution.duration,
        },
        'Execution marked as failed'
      );

      return Result.ok({
        executionId: updatedExecution.id.getValue(),
        duration: updatedExecution.duration!,
        failedAt: updatedExecution.finishedAt!,
        error: updatedExecution.error!,
      });
    } catch (error) {
      logger.error(
        {
          requestId: input.requestId,
          executionId: input.executionId,
          error,
        },
        'Failed to mark execution as failed'
      );
      return Result.fail('Failed to mark execution as failed');
    }
  }
}
