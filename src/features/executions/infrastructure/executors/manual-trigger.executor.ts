import type { NodeExecutor, ExecutionContext, ExecutionResult } from './executor.types';

/**
 * Executor for MANUAL_TRIGGER node type
 * Triggered manually by user action
 */
export class ManualTriggerExecutor implements NodeExecutor {
  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Manual trigger passes through the initial data provided by the user
      // This could include form data, button click context, etc.
      return {
        success: true,
        data: {
          triggeredAt: new Date().toISOString(),
          triggeredBy: 'manual',
          ...context.previousData,
        },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: 'MANUAL_TRIGGER',
          trigger: 'manual',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in MANUAL_TRIGGER executor',
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: 'MANUAL_TRIGGER',
        },
      };
    }
  }

  async validate(context: ExecutionContext): Promise<boolean> {
    // Manual trigger has no specific validation requirements
    return true;
  }
}
