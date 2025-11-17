import { Execution, ExecutionStatus, ExecutionMode } from '../entities/execution.entity';

export interface ExecutionFilters {
  workflowId?: string;
  userId?: string;
  status?: ExecutionStatus;
  mode?: ExecutionMode;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IExecutionRepository {
  /**
   * Find execution by ID
   */
  findById(id: string): Promise<Execution | null>;

  /**
   * Find all executions with filters and pagination
   */
  findMany(
    filters: ExecutionFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Execution>>;

  /**
   * Find executions by workflow ID
   */
  findByWorkflowId(
    workflowId: string,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Execution>>;

  /**
   * Find executions by user ID
   */
  findByUserId(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<Execution>>;

  /**
   * Get latest execution for a workflow
   */
  findLatestByWorkflowId(workflowId: string): Promise<Execution | null>;

  /**
   * Create a new execution
   */
  create(execution: Execution): Promise<Execution>;

  /**
   * Update an existing execution
   */
  update(execution: Execution): Promise<Execution>;

  /**
   * Delete an execution
   */
  delete(id: string): Promise<void>;

  /**
   * Count executions with filters
   */
  count(filters: ExecutionFilters): Promise<number>;

  /**
   * Get execution statistics
   */
  getStatistics(filters: ExecutionFilters): Promise<ExecutionStatistics>;
}

export interface ExecutionStatistics {
  total: number;
  success: number;
  failed: number;
  running: number;
  pending: number;
  cancelled: number;
  averageDuration: number; // milliseconds
}
