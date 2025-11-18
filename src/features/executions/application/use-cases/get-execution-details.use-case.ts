import { IExecutionRepository } from '../../domain/repositories/execution.repository.interface';
import {
  ExecutionStatus,
  ExecutionMode,
  ExecutionNodeResults,
} from '../../domain/entities/execution.entity';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface GetExecutionDetailsInput {
  executionId: string;
  requestId?: string;
}

export interface GetExecutionDetailsOutput {
  id: string;
  workflowId: string;
  userId: string;
  status: ExecutionStatus;
  mode: ExecutionMode;
  startedAt: Date;
  finishedAt?: Date;
  duration?: number;
  error?: string;
  errorStack?: string;
  nodeResults?: ExecutionNodeResults;
  triggerData?: unknown;
  formattedDuration: string;
  isRunning: boolean;
  isFinished: boolean;
  isSuccessful: boolean;
  hasFailed: boolean;
}

export class GetExecutionDetailsUseCase {
  constructor(private readonly executionRepository: IExecutionRepository) {}

  async execute(
    input: GetExecutionDetailsInput
  ): Promise<Result<GetExecutionDetailsOutput, string>> {
    try {
      logger.debug(
        {
          requestId: input.requestId,
          executionId: input.executionId,
        },
        'Getting execution details'
      );

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

      logger.info(
        {
          requestId: input.requestId,
          executionId: execution.id.getValue(),
          status: execution.status,
        },
        'Execution details retrieved successfully'
      );

      return Result.ok({
        id: execution.id.getValue(),
        workflowId: execution.workflowId,
        userId: execution.userId,
        status: execution.status,
        mode: execution.mode,
        startedAt: execution.startedAt,
        finishedAt: execution.finishedAt,
        duration: execution.duration,
        error: execution.error,
        errorStack: execution.errorStack,
        nodeResults: execution.nodeResults,
        triggerData: execution.triggerData,
        formattedDuration: execution.getFormattedDuration(),
        isRunning: execution.isRunning(),
        isFinished: execution.isFinished(),
        isSuccessful: execution.isSuccessful(),
        hasFailed: execution.hasFailed(),
      });
    } catch (error) {
      logger.error(
        {
          requestId: input.requestId,
          executionId: input.executionId,
          error,
        },
        'Failed to get execution details'
      );
      return Result.fail('Failed to get execution details');
    }
  }
}
