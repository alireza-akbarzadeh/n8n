import { Workflow } from '../entities/workflow.entity';
import { PaginationParams, PaginatedResponse } from '@/core/types/common.types';

/**
 * Search parameters for workflows
 */
export interface WorkflowSearchParams extends PaginationParams {
  search?: string;
  userId: string;
}

/**
 * Workflow Repository Interface
 *
 * Defines the contract for workflow persistence
 * Implementations in the infrastructure layer
 */
export interface IWorkflowRepository {
  /**
   * Find a workflow by ID
   */
  findById(id: string, userId: string): Promise<Workflow | null>;

  /**
   * Find all workflows for a user
   */
  findMany(params: WorkflowSearchParams): Promise<PaginatedResponse<Workflow>>;

  /**
   * Create a new workflow
   */
  create(workflow: Workflow): Promise<Workflow>;

  /**
   * Update an existing workflow
   */
  update(workflow: Workflow): Promise<Workflow>;

  /**
   * Delete a workflow
   */
  delete(id: string, userId: string): Promise<void>;

  /**
   * Check if a workflow exists
   */
  exists(id: string, userId: string): Promise<boolean>;

  /**
   * Count workflows for a user
   */
  count(userId: string, search?: string): Promise<number>;
}
