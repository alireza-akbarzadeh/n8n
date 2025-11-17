import {
  IExecutionRepository,
  ExecutionFilters,
  PaginationOptions,
  PaginatedResult,
  ExecutionStatistics,
} from '../../domain/repositories/execution.repository.interface';
import { Execution, ExecutionStatus } from '../../domain/entities/execution.entity';
import { ExecutionMapper } from '../mappers/execution.mapper';
import logger from '@/src/shared/infrastructure/logger/logger';
import { Prisma } from '@/prisma/generated/prisma/client';
import { prisma } from '@/src/shared/infrastructure';

export class PrismaExecutionRepository implements IExecutionRepository {
  async findById(id: string): Promise<Execution | null> {
    try {
      const execution = await prisma.execution.findUnique({
        where: { id },
      });

      if (!execution) {
        return null;
      }

      return ExecutionMapper.toDomain(execution);
    } catch (error) {
      logger.error({ error, executionId: id }, 'Failed to find execution by ID');
      throw error;
    }
  }

  async findMany(
    filters: ExecutionFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Execution>> {
    try {
      const where = this.buildWhereClause(filters);
      const skip = (pagination.page - 1) * pagination.limit;

      const [executions, total] = await Promise.all([
        prisma.execution.findMany({
          where,
          skip,
          take: pagination.limit,
          orderBy: { startedAt: 'desc' },
        }),
        prisma.execution.count({ where }),
      ]);

      return {
        items: executions.map(ExecutionMapper.toDomain),
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      };
    } catch (error) {
      logger.error({ error, filters }, 'Failed to find executions');
      throw error;
    }
  }

  async findByWorkflowId(
    workflowId: string,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Execution>> {
    return this.findMany({ workflowId }, pagination);
  }

  async findByUserId(
    userId: string,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Execution>> {
    return this.findMany({ userId }, pagination);
  }

  async findLatestByWorkflowId(workflowId: string): Promise<Execution | null> {
    try {
      const execution = await prisma.execution.findFirst({
        where: { workflowId },
        orderBy: { startedAt: 'desc' },
      });

      if (!execution) {
        return null;
      }

      return ExecutionMapper.toDomain(execution);
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to find latest execution');
      throw error;
    }
  }

  async create(execution: Execution): Promise<Execution> {
    try {
      const data = ExecutionMapper.toPrismaCreate(execution);

      const created = await prisma.execution.create({
        data,
      });

      logger.info({ executionId: created.id, workflowId: created.workflowId }, 'Execution created');

      return ExecutionMapper.toDomain(created);
    } catch (error) {
      logger.error({ error, execution }, 'Failed to create execution');
      throw error;
    }
  }

  async update(execution: Execution): Promise<Execution> {
    try {
      const data = ExecutionMapper.toPrismaUpdate(execution);

      const updated = await prisma.execution.update({
        where: { id: execution.id.getValue() },
        data,
      });

      logger.info({ executionId: updated.id, status: updated.status }, 'Execution updated');

      return ExecutionMapper.toDomain(updated);
    } catch (error) {
      logger.error({ error, executionId: execution.id.getValue() }, 'Failed to update execution');
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.execution.delete({
        where: { id },
      });

      logger.info({ executionId: id }, 'Execution deleted');
    } catch (error) {
      logger.error({ error, executionId: id }, 'Failed to delete execution');
      throw error;
    }
  }

  async count(filters: ExecutionFilters): Promise<number> {
    try {
      const where = this.buildWhereClause(filters);
      return await prisma.execution.count({ where });
    } catch (error) {
      logger.error({ error, filters }, 'Failed to count executions');
      throw error;
    }
  }

  async getStatistics(filters: ExecutionFilters): Promise<ExecutionStatistics> {
    try {
      const where = this.buildWhereClause(filters);

      const [total, statusCounts, avgDuration] = await Promise.all([
        prisma.execution.count({ where }),
        prisma.execution.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        prisma.execution.aggregate({
          where: {
            ...where,
            duration: { not: null },
          },
          _avg: {
            duration: true,
          },
        }),
      ]);

      const stats: ExecutionStatistics = {
        total,
        success: 0,
        failed: 0,
        running: 0,
        pending: 0,
        cancelled: 0,
        averageDuration: avgDuration._avg.duration || 0,
      };

      statusCounts.forEach((item: { status: string; _count: number }) => {
        const status = item.status as ExecutionStatus;
        switch (status) {
          case ExecutionStatus.SUCCESS:
            stats.success = item._count;
            break;
          case ExecutionStatus.FAILED:
            stats.failed = item._count;
            break;
          case ExecutionStatus.RUNNING:
            stats.running = item._count;
            break;
          case ExecutionStatus.PENDING:
            stats.pending = item._count;
            break;
          case ExecutionStatus.CANCELLED:
            stats.cancelled = item._count;
            break;
        }
      });

      return stats;
    } catch (error) {
      logger.error({ error, filters }, 'Failed to get execution statistics');
      throw error;
    }
  }

  private buildWhereClause(filters: ExecutionFilters): Prisma.ExecutionWhereInput {
    const where: Prisma.ExecutionWhereInput = {};

    if (filters.workflowId) {
      where.workflowId = filters.workflowId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.mode) {
      where.mode = filters.mode;
    }

    if (filters.startDate || filters.endDate) {
      where.startedAt = {};
      if (filters.startDate) {
        where.startedAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.startedAt.lte = filters.endDate;
      }
    }

    return where;
  }
}
