import { Execution, ExecutionStatus, ExecutionMode } from '../../domain/entities/execution.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import type { Execution as PrismaExecution } from '@/prisma/generated/prisma/client';

export class ExecutionMapper {
  /**
   * Convert Prisma model to domain entity
   */
  static toDomain(prismaExecution: PrismaExecution): Execution {
    const executionResult = Execution.create(
      {
        workflowId: prismaExecution.workflowId,
        userId: prismaExecution.userId,
        status: prismaExecution.status as ExecutionStatus,
        mode: prismaExecution.mode as ExecutionMode,
        startedAt: prismaExecution.startedAt,
        finishedAt: prismaExecution.finishedAt || undefined,
        duration: prismaExecution.duration || undefined,
        error: prismaExecution.error || undefined,
        errorStack: prismaExecution.errorStack || undefined,
        nodeResults: prismaExecution.nodeResults
          ? JSON.parse(JSON.stringify(prismaExecution.nodeResults))
          : undefined,
        triggerData: prismaExecution.triggerData
          ? JSON.parse(JSON.stringify(prismaExecution.triggerData))
          : undefined,
        createdAt: prismaExecution.startedAt,
        updatedAt: prismaExecution.finishedAt || prismaExecution.startedAt,
      },
      ID.create(prismaExecution.id)
    );

    if (!executionResult.success) {
      throw new Error(`Failed to create execution entity: ${executionResult.error}`);
    }

    return executionResult.data;
  }

  /**
   * Convert domain entity to Prisma create input
   */
  static toPrismaCreate(execution: Execution) {
    return {
      id: execution.id.getValue(),
      workflowId: execution.workflowId,
      userId: execution.userId,
      status: execution.status,
      mode: execution.mode,
      startedAt: execution.startedAt,
      finishedAt: execution.finishedAt || null,
      duration: execution.duration || null,
      error: execution.error || null,
      errorStack: execution.errorStack || null,
      nodeResults: execution.nodeResults ? JSON.parse(JSON.stringify(execution.nodeResults)) : null,
      triggerData: execution.triggerData ? JSON.parse(JSON.stringify(execution.triggerData)) : null,
    };
  }

  /**
   * Convert domain entity to Prisma update input
   */
  static toPrismaUpdate(execution: Execution) {
    return {
      workflowId: execution.workflowId,
      userId: execution.userId,
      status: execution.status,
      mode: execution.mode,
      startedAt: execution.startedAt,
      finishedAt: execution.finishedAt || null,
      duration: execution.duration || null,
      error: execution.error || null,
      errorStack: execution.errorStack || null,
      nodeResults: execution.nodeResults ? JSON.parse(JSON.stringify(execution.nodeResults)) : null,
      triggerData: execution.triggerData ? JSON.parse(JSON.stringify(execution.triggerData)) : null,
    };
  }
}
