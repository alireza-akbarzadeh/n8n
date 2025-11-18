import { BaseEntity } from '@/shared/domain/entities/base.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import { Result } from '@/core/types/common.types';

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum ExecutionMode {
  MANUAL = 'MANUAL',
  WEBHOOK = 'WEBHOOK',
  SCHEDULE = 'SCHEDULE',
  TEST = 'TEST',
}

export interface NodeResult {
  success: boolean;
  data?: unknown;
  error?: string;
  executionTime?: number;
}

export interface ExecutionNodeResults {
  [nodeId: string]: NodeResult;
}

export interface ExecutionProps {
  workflowId: string;
  userId: string;
  status: ExecutionStatus;
  mode: ExecutionMode;
  startedAt: Date;
  finishedAt?: Date;
  duration?: number; // milliseconds
  error?: string;
  errorStack?: string;
  nodeResults?: ExecutionNodeResults;
  triggerData?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Execution extends BaseEntity<ExecutionProps> {
  private constructor(id: ID, props: ExecutionProps) {
    super(id, props);
  }

  get workflowId(): string {
    return this.props.workflowId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): ExecutionStatus {
    return this.props.status;
  }

  get mode(): ExecutionMode {
    return this.props.mode;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get finishedAt(): Date | undefined {
    return this.props.finishedAt;
  }

  get duration(): number | undefined {
    return this.props.duration;
  }

  get error(): string | undefined {
    return this.props.error;
  }

  get errorStack(): string | undefined {
    return this.props.errorStack;
  }

  get nodeResults(): ExecutionNodeResults | undefined {
    return this.props.nodeResults;
  }

  get triggerData(): unknown | undefined {
    return this.props.triggerData;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  /**
   * Start the execution
   */
  start(): void {
    if (this.props.status !== ExecutionStatus.PENDING) {
      throw new Error('Only pending executions can be started');
    }

    this.props.status = ExecutionStatus.RUNNING;
    this.props.startedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Complete the execution successfully
   */
  complete(nodeResults?: ExecutionNodeResults): void {
    if (this.props.status !== ExecutionStatus.RUNNING) {
      throw new Error('Only running executions can be completed');
    }

    this.props.status = ExecutionStatus.SUCCESS;
    this.props.finishedAt = new Date();
    this.props.duration = this.calculateDuration();
    this.props.nodeResults = nodeResults;
    this.props.updatedAt = new Date();
  }

  /**
   * Fail the execution with error details
   */
  fail(error: string, errorStack?: string, nodeResults?: ExecutionNodeResults): void {
    if (
      this.props.status !== ExecutionStatus.RUNNING &&
      this.props.status !== ExecutionStatus.PENDING
    ) {
      throw new Error('Only running or pending executions can be failed');
    }

    this.props.status = ExecutionStatus.FAILED;
    this.props.finishedAt = new Date();
    this.props.duration = this.calculateDuration();
    this.props.error = error;
    this.props.errorStack = errorStack;
    this.props.nodeResults = nodeResults;
    this.props.updatedAt = new Date();
  }

  /**
   * Cancel the execution
   */
  cancel(): void {
    if (
      this.props.status !== ExecutionStatus.RUNNING &&
      this.props.status !== ExecutionStatus.PENDING
    ) {
      throw new Error('Only running or pending executions can be cancelled');
    }

    this.props.status = ExecutionStatus.CANCELLED;
    this.props.finishedAt = new Date();
    this.props.duration = this.calculateDuration();
    this.props.updatedAt = new Date();
  }

  /**
   * Check if execution is finished
   */
  isFinished(): boolean {
    return (
      this.props.status === ExecutionStatus.SUCCESS ||
      this.props.status === ExecutionStatus.FAILED ||
      this.props.status === ExecutionStatus.CANCELLED
    );
  }

  /**
   * Check if execution is running
   */
  isRunning(): boolean {
    return this.props.status === ExecutionStatus.RUNNING;
  }

  /**
   * Check if execution was successful
   */
  isSuccessful(): boolean {
    return this.props.status === ExecutionStatus.SUCCESS;
  }

  /**
   * Check if execution failed
   */
  hasFailed(): boolean {
    return this.props.status === ExecutionStatus.FAILED;
  }

  /**
   * Get the result for a specific node
   */
  getNodeResult(nodeId: string): NodeResult | undefined {
    return this.props.nodeResults?.[nodeId];
  }

  /**
   * Check if a specific node was successful
   */
  isNodeSuccessful(nodeId: string): boolean {
    const result = this.getNodeResult(nodeId);
    return result?.success === true;
  }

  /**
   * Get all failed nodes
   */
  getFailedNodes(): string[] {
    if (!this.props.nodeResults) return [];

    return Object.entries(this.props.nodeResults)
      .filter(([, result]) => !result.success)
      .map(([nodeId]) => nodeId);
  }

  /**
   * Calculate duration in milliseconds
   */
  private calculateDuration(): number {
    if (!this.props.finishedAt) {
      return 0;
    }

    return this.props.finishedAt.getTime() - this.props.startedAt.getTime();
  }

  /**
   * Get duration in a human-readable format
   */
  getFormattedDuration(): string {
    if (!this.props.duration) {
      return 'N/A';
    }

    const seconds = Math.floor(this.props.duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else if (seconds > 0) {
      return `${seconds}s`;
    } else {
      return `${this.props.duration}ms`;
    }
  }

  /**
   * Validate execution properties
   */
  static validate(props: Partial<ExecutionProps>): Result<void, string> {
    if (props.workflowId !== undefined && !props.workflowId.trim()) {
      return Result.fail('Workflow ID is required');
    }

    if (props.userId !== undefined && !props.userId.trim()) {
      return Result.fail('User ID is required');
    }

    if (props.duration !== undefined && props.duration < 0) {
      return Result.fail('Duration cannot be negative');
    }

    if (props.error !== undefined && props.error.length > 5000) {
      return Result.fail('Error message is too long (max 5000 characters)');
    }

    return Result.ok(undefined);
  }

  /**
   * Create a new execution entity
   */
  static create(props: ExecutionProps, id?: ID): Result<Execution, string> {
    const validation = this.validate(props);
    if (!validation.success) {
      return Result.fail(validation.error!);
    }

    const executionId = id || ID.generate();
    const execution = new Execution(executionId, {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });

    return Result.ok(execution);
  }
}
