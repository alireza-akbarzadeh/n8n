import { NodeType } from '@/prisma/generated/prisma/enums';
import type { NodeExecutor, ExecutorFactory } from './executor.types';
import { InitialExecutor } from './initial.executor';
import { ManualTriggerExecutor } from './manual-trigger.executor';
import { HttpRequestExecutor } from './http-request.executor';

/**
 * Registry of all node executors
 * Maps NodeType to executor factory functions
 * Note: Only implemented node types are included. Others will throw an error.
 */
export const executorRegistry: Partial<Record<NodeType, ExecutorFactory>> = {
  [NodeType.INITIAL]: () => new InitialExecutor(),
  [NodeType.MANUAL_TRIGGER]: () => new ManualTriggerExecutor(),
  [NodeType.HTTP_REQUEST]: () => new HttpRequestExecutor(),
  // TODO: Implement remaining node types:
  // [NodeType.WEBHOOK_TRIGGER]: () => new WebhookTriggerExecutor(),
  // [NodeType.SCHEDULE_TRIGGER]: () => new ScheduleTriggerExecutor(),
  // [NodeType.EMAIL_TRIGGER]: () => new EmailTriggerExecutor(),
  // [NodeType.SEND_EMAIL]: () => new SendEmailExecutor(),
  // [NodeType.DATABASE_QUERY]: () => new DatabaseQueryExecutor(),
  // [NodeType.DATA_TRANSFORMER]: () => new DataTransformerExecutor(),
  // [NodeType.CODE_EXECUTOR]: () => new CodeExecutorExecutor(),
  // [NodeType.FILTER]: () => new FilterExecutor(),
  // [NodeType.ROUTER]: () => new RouterExecutor(),
  // [NodeType.MERGE]: () => new MergeExecutor(),
  // [NodeType.SPLIT]: () => new SplitExecutor(),
  // [NodeType.GOOGLE_SHEETS]: () => new GoogleSheetsExecutor(),
  // [NodeType.SLACK]: () => new SlackExecutor(),
  // [NodeType.GITHUB]: () => new GithubExecutor(),
};

/**
 * Get executor instance for a given node type
 * @throws Error if no executor found for the node type
 */
export const getExecutor = (type: NodeType): NodeExecutor => {
  const executorFactory = executorRegistry[type];

  if (!executorFactory) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executorFactory();
};

/**
 * Check if an executor exists for a given node type
 */
export const hasExecutor = (type: NodeType): boolean => {
  return type in executorRegistry;
};

/**
 * Get all supported node types
 */
export const getSupportedNodeTypes = (): NodeType[] => {
  return Object.keys(executorRegistry) as NodeType[];
};
