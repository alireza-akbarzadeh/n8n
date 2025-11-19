import type { NodeExecutor, ExecutionContext, ExecutionResult } from './executor.types';

/**
 * Executor for HTTP_REQUEST node type
 * Makes HTTP requests to external APIs
 */
export class HttpRequestExecutor implements NodeExecutor {
  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // TODO: Implement HTTP request logic
      // 1. Get node configuration (URL, method, headers, body)
      // 2. Make HTTP request using fetch
      // 3. Handle response and errors
      // 4. Transform response data

      // Placeholder implementation
      console.log('HTTP_REQUEST executor - context:', context);

      return {
        success: true,
        data: {
          // TODO: Return actual HTTP response data
          placeholder: 'HTTP request execution not yet implemented',
          ...context.previousData,
        },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: 'HTTP_REQUEST',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in HTTP_REQUEST executor',
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: 'HTTP_REQUEST',
        },
      };
    }
  }

  async validate(): Promise<boolean> {
    // TODO: Validate HTTP request configuration
    // - URL is valid
    // - Method is supported
    // - Headers are properly formatted
    return true;
  }
}
