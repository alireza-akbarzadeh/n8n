import type { NodeExecutor, ExecutionContext, ExecutionResult } from './executor.types';

/**
 * Executor for INITIAL node type
 * This is the starting point of a workflow
 */
export class InitialExecutor implements NodeExecutor {
  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Initial node just passes through the input data
      // It marks the beginning of the workflow execution
      return {
        success: true,
        data: context.previousData || {},
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: 'INITIAL',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in INITIAL executor',
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: 'INITIAL',
        },
      };
    }
  }

  async validate(context: ExecutionContext): Promise<boolean> {
    // Initial node has no specific validation requirements
    return true;
  }
}
