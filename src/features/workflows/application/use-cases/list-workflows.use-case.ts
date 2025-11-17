import { IWorkflowRepository } from '../../domain/repositories/workflow.repository.interface';
import { Result, PaginatedResponse } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';
import { PAGINATION } from '@/core/config/constants';

export interface ListWorkflowsInput {
  userId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  requestId?: string;
}

export interface WorkflowListItem {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * List Workflows Use Case
 *
 * Retrieves paginated list of workflows for a user
 */
export class ListWorkflowsUseCase {
  constructor(private readonly workflowRepository: IWorkflowRepository) {}

  async execute(
    input: ListWorkflowsInput
  ): Promise<Result<PaginatedResponse<WorkflowListItem>, string>> {
    const {
      userId,
      page = PAGINATION.DEFAULT_PAGE,
      pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
      search,
      requestId,
    } = input;

    logger.debug(
      {
        requestId,
        userId,
        page,
        pageSize,
        search,
      },
      'Fetching workflows'
    );

    try {
      // Fetch workflows
      const result = await this.workflowRepository.findMany({
        userId,
        page,
        pageSize,
        search,
      });

      // Map to list items
      const items: WorkflowListItem[] = result.data.map((workflow) => ({
        id: workflow.id.getValue(),
        name: workflow.name,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
      }));

      logger.info(
        {
          requestId,
          userId,
          totalCount: result.meta.totalCount,
          page,
          totalPages: result.meta.totalPages,
        },
        'Workflows retrieved successfully'
      );

      return Result.ok({
        data: items,
        meta: result.meta,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to list workflows'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to list workflows');
    }
  }
}
