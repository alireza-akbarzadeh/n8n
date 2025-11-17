import { IExecutionRepository } from '../../domain/repositories/execution.repository.interface';
import { Execution, ExecutionMode, ExecutionStatus } from '../../domain/entities/execution.entity';
import { Result } from '@/core/types/common.types';
import { logger } from '@/lib/logger';

export interface StartExecutionInput {
  workflowId: string;
  userId: string;
  mode: ExecutionMode;
  triggerData?: unknown;
  requestId?: string;
}

export interface StartExecutionOutput {
  executionId: string;
  workflowId: string;
  status: ExecutionStatus;
  startedAt: Date;
}

export class StartExecutionUseCase {
  constructor(private readonly executionRepository: IExecutionRepository) {}

  async execute(input: StartExecutionInput): Promise<Result<StartExecutionOutput, string>> {
    try {
      logger.debug(
        {
          requestId: input.requestId,
          workflowId: input.workflowId,
          userId: input.userId,
          mode: input.mode,
        },
        'Starting execution'
      );

      // Create execution entity
      const executionResult = Execution.create({
        workflowId: input.workflowId,
        userId: input.userId,
        status: ExecutionStatus.PENDING,
        mode: input.mode,
        startedAt: new Date(),
        triggerData: input.triggerData,
      });

      if (!executionResult.success) {
        logger.warn(
          {
            requestId: input.requestId,
            error: executionResult.error,
          },
          'Failed to create execution entity'
        );
        return Result.fail(executionResult.error);
      }

      const execution = executionResult.data;

      // Save to repository
      const savedExecution = await this.executionRepository.create(execution);

      logger.info(
        {
          requestId: input.requestId,
          executionId: savedExecution.id.getValue(),
          workflowId: savedExecution.workflowId,
        },
        'Execution started successfully'
      );

      return Result.ok({
        executionId: savedExecution.id.getValue(),
        workflowId: savedExecution.workflowId,
        status: savedExecution.status,
        startedAt: savedExecution.startedAt,
      });
    } catch (error) {
      logger.error(
        {
          requestId: input.requestId,
          workflowId: input.workflowId,
          error,
        },
        'Failed to start execution'
      );
      return Result.fail('Failed to start execution');
    }
  }
}
