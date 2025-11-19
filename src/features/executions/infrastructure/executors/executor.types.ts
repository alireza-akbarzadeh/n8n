import { NodeType } from '@/prisma/generated/prisma/enums';

/**
 * Context passed to each node executor
 */
export interface ExecutionContext {
  workflowId: string;
  executionId: string;
  nodeId: string;
  previousData?: Record<string, unknown>;
  environment: Record<string, unknown>;
}

/**
 * Result returned by each node executor
 */
export interface ExecutionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  metadata?: {
    executionTime?: number;
    retries?: number;
    [key: string]: unknown;
  };
}

/**
 * Base interface for all node executors
 */
export interface NodeExecutor {
  /**
   * Execute the node with given context
   */
  execute(context: ExecutionContext): Promise<ExecutionResult>;

  /**
   * Validate node configuration before execution
   */
  validate?(context: ExecutionContext): Promise<boolean>;
}

/**
 * Factory function type for creating executors
 */
export type ExecutorFactory = () => NodeExecutor;
