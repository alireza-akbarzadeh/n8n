/**
 * Node Executors
 *
 * This module provides the execution engine for different node types.
 * Each node type has its own executor that implements the NodeExecutor interface.
 *
 * Architecture:
 * - executorRegistry: Maps NodeType to executor factories
 * - getExecutor(): Returns executor instance for a node type
 * - Each executor implements: execute() and validate()
 *
 * Usage:
 * ```typescript
 * import { getExecutor } from './executors';
 *
 * const executor = getExecutor(NodeType.HTTP_REQUEST);
 * const result = await executor.execute(context);
 * ```
 */

export * from './executor.types';
export * from './registry';
export * from './initial.executor';
export * from './manual-trigger.executor';
export * from './http-request.executor';
