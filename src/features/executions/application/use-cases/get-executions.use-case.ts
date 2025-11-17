import {
  IExecutionRepository,
  ExecutionFilters,
  PaginationOptions,
} from '../../domain/repositories/execution.repository.interface';
import { ExecutionStatus, ExecutionMode } from '../../domain/entities/execution.entity';
import { Result } from '@/core/types/common.types';
import logger from '@/src/shared/infrastructure/logger/logger';

export interface GetExecutionsInput {
  workflowId?: string;
  userId?: string;
  status?: ExecutionStatus;
  mode?: ExecutionMode;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
  requestId?: string;
}

export interface ExecutionSummary {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  mode: ExecutionMode;
  startedAt: Date;
  finishedAt?: Date;
  duration?: number;
  error?: string;
}

export interface GetExecutionsOutput {
  executions: ExecutionSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetExecutionsUseCase {
  constructor(private readonly executionRepository: IExecutionRepository) {}

  async execute(input: GetExecutionsInput): Promise<Result<GetExecutionsOutput, string>> {
    try {
      logger.debug(
        {
          requestId: input.requestId,
          filters: {
            workflowId: input.workflowId,
            userId: input.userId,
            status: input.status,
            mode: input.mode,
          },
          pagination: {
            page: input.page,
            limit: input.limit,
          },
        },
        'Getting executions'
      );

      const filters: ExecutionFilters = {
        workflowId: input.workflowId,
        userId: input.userId,
        status: input.status,
        mode: input.mode,
        startDate: input.startDate,
        endDate: input.endDate,
      };

      const pagination: PaginationOptions = {
        page: input.page,
        limit: input.limit,
      };

      const result = await this.executionRepository.findMany(filters, pagination);

      const executions: ExecutionSummary[] = result.items.map((execution) => ({
        id: execution.id.getValue(),
        workflowId: execution.workflowId,
        status: execution.status,
        mode: execution.mode,
        startedAt: execution.startedAt,
        finishedAt: execution.finishedAt,
        duration: execution.duration,
        error: execution.error,
      }));

      logger.info(
        {
          requestId: input.requestId,
          count: executions.length,
          total: result.total,
        },
        'Executions retrieved successfully'
      );

      return Result.ok({
        executions,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      logger.error(
        {
          requestId: input.requestId,
          error,
        },
        'Failed to get executions'
      );
      return Result.fail('Failed to get executions');
    }
  }
}
