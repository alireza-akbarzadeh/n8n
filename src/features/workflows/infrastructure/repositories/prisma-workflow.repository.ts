import {
  IWorkflowRepository,
  WorkflowSearchParams,
} from '../../domain/repositories/workflow.repository.interface';
import { Workflow } from '../../domain/entities/workflow.entity';
import { PaginatedResponse } from '@/core/types/common.types';
import { prisma } from '@/shared/infrastructure/database/prisma.client';
import { WorkflowMapper } from '../mappers/workflow.mapper';
import { PAGINATION } from '@/core/config/constants';
import type {
  Workflow as PrismaWorkflow,
  Node as PrismaNode,
  Connection,
} from '@/prisma/generated/prisma';

/**
 * Prisma Workflow Repository
 *
 * Implements IWorkflowRepository using Prisma ORM
 */
export class PrismaWorkflowRepository implements IWorkflowRepository {
  private readonly db = prisma;

  /**
   * Find a workflow by ID
   */
  async findById(id: string, userId: string): Promise<Workflow | null> {
    const prismaWorkflow = await this.db.workflow.findFirst({
      where: { id, userId },
      include: {
        nodes: true,
        connection: true,
      },
    });

    if (!prismaWorkflow) {
      return null;
    }

    return WorkflowMapper.toDomain(prismaWorkflow);
  }

  /**
   * Find all workflows for a user
   */
  async findMany(params: WorkflowSearchParams): Promise<PaginatedResponse<Workflow>> {
    const {
      userId,
      search,
      page = PAGINATION.DEFAULT_PAGE,
      pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    } = params;

    const where = {
      userId,
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [prismaWorkflows, totalCount] = await Promise.all([
      this.db.workflow.findMany({
        where,
        include: {
          nodes: true,
          connection: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.db.workflow.count({ where }),
    ]);

    const workflows = prismaWorkflows.map((pw: any) => WorkflowMapper.toDomain(pw));
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: workflows,
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Create a new workflow
   */
  async create(workflow: Workflow): Promise<Workflow> {
    const data = WorkflowMapper.toPrismaCreate(workflow);

    const prismaWorkflow = await this.db.workflow.create({
      data,
      include: {
        nodes: true,
        connection: true,
      },
    });

    return WorkflowMapper.toDomain(prismaWorkflow);
  }

  /**
   * Update an existing workflow
   */
  async update(workflow: Workflow): Promise<Workflow> {
    const workflowId = workflow.id.getValue();
    const userId = workflow.userId;

    // Delete existing nodes and connections, then create new ones
    await this.db.$transaction(async (tx: any) => {
      // Delete existing nodes and connections
      await tx.node.deleteMany({ where: { workflowId } });
      await tx.connection.deleteMany({ where: { workflowId } });

      // Update workflow name and timestamp
      await tx.workflow.update({
        where: { id: workflowId, userId },
        data: WorkflowMapper.toPrismaUpdate(workflow),
      });

      // Create new nodes
      if (workflow.nodes.length > 0) {
        const bulkData = WorkflowMapper.toPrismaBulkUpdate(workflow);
        await tx.node.createMany({
          data: bulkData.nodes.map((node) => ({
            ...node,
            workflowId,
          })),
        });

        // Create new connections
        if (bulkData.connections.length > 0) {
          await tx.connection.createMany({
            data: bulkData.connections.map((conn) => ({
              ...conn,
              workflowId,
            })),
          });
        }
      }
    });

    // Fetch and return the updated workflow
    const updatedWorkflow = await this.findById(workflowId, userId);
    if (!updatedWorkflow) {
      throw new Error('Workflow not found after update');
    }

    return updatedWorkflow;
  }

  /**
   * Delete a workflow
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.db.workflow.delete({
      where: { id, userId },
    });
  }

  /**
   * Check if a workflow exists
   */
  async exists(id: string, userId: string): Promise<boolean> {
    const count = await this.db.workflow.count({
      where: { id, userId },
    });
    return count > 0;
  }

  /**
   * Count workflows for a user
   */
  async count(userId: string, search?: string): Promise<number> {
    return this.db.workflow.count({
      where: {
        userId,
        ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
      },
    });
  }
}
