import { BaseEntity } from '@/shared/domain/entities/base.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import { Result } from '@/core/types/common.types';

export interface EdgeProps {
  workflowId: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle: string;
  targetHandle: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Edge Entity
 *
 * Represents a connection between two nodes in a workflow.
 * Defines the data flow between nodes.
 */
export class Edge extends BaseEntity<EdgeProps> {
  private constructor(id: ID, props: EdgeProps) {
    super(id, props);
  }

  /**
   * Create a new edge
   */
  public static create(props: EdgeProps, id?: ID): Result<Edge, string> {
    // Validate workflow ID
    if (!props.workflowId || props.workflowId.trim().length === 0) {
      return Result.fail('Workflow ID is required');
    }

    // Validate source node ID
    if (!props.sourceNodeId || props.sourceNodeId.trim().length === 0) {
      return Result.fail('Source node ID is required');
    }

    // Validate target node ID
    if (!props.targetNodeId || props.targetNodeId.trim().length === 0) {
      return Result.fail('Target node ID is required');
    }

    // Validate that source and target are different
    if (props.sourceNodeId === props.targetNodeId) {
      return Result.fail('Source and target nodes must be different');
    }

    // Apply default handles before validation (handle empty strings and null/undefined)
    const sourceHandle = props.sourceHandle?.trim() || 'main';
    const targetHandle = props.targetHandle?.trim() || 'main';

    // Validate handles
    const handleValidation = this.validateHandles(sourceHandle, targetHandle);
    if (!handleValidation.success) {
      return Result.fail(handleValidation.error!);
    }

    const edgeId = id || ID.generate();
    const edge = new Edge(edgeId, {
      ...props,
      sourceHandle,
      targetHandle,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });

    return Result.ok(edge);
  }

  /**
   * Getters
   */
  get workflowId(): string {
    return this.props.workflowId;
  }

  get sourceNodeId(): string {
    return this.props.sourceNodeId;
  }

  get targetNodeId(): string {
    return this.props.targetNodeId;
  }

  get sourceHandle(): string {
    return this.props.sourceHandle;
  }

  get targetHandle(): string {
    return this.props.targetHandle;
  }

  /**
   * Check if this edge connects to a specific node
   */
  public connectsToNode(nodeId: string): boolean {
    return this.props.sourceNodeId === nodeId || this.props.targetNodeId === nodeId;
  }

  /**
   * Check if this edge connects two specific nodes
   */
  public connectsNodes(sourceNodeId: string, targetNodeId: string): boolean {
    return this.props.sourceNodeId === sourceNodeId && this.props.targetNodeId === targetNodeId;
  }

  /**
   * Update source handle
   */
  public updateSourceHandle(handle: string): Result<void, string> {
    const validation = Edge.validateHandle(handle);
    if (!validation.success) {
      return Result.fail(validation.error!);
    }

    this.props.sourceHandle = handle;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Update target handle
   */
  public updateTargetHandle(handle: string): Result<void, string> {
    const validation = Edge.validateHandle(handle);
    if (!validation.success) {
      return Result.fail(validation.error!);
    }

    this.props.targetHandle = handle;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Validate a handle
   */
  private static validateHandle(handle: string): Result<void, string> {
    if (!handle || handle.trim().length === 0) {
      return Result.fail('Handle cannot be empty');
    }

    if (handle.length > 50) {
      return Result.fail('Handle cannot exceed 50 characters');
    }

    // Alphanumeric and underscore only
    if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
      return Result.fail('Handle can only contain alphanumeric characters and underscores');
    }

    return Result.ok(undefined);
  }

  /**
   * Validate both handles
   */
  private static validateHandles(sourceHandle: string, targetHandle: string): Result<void, string> {
    const sourceValidation = this.validateHandle(sourceHandle);
    if (!sourceValidation.success) {
      return Result.fail(`Source handle: ${sourceValidation.error}`);
    }

    const targetValidation = this.validateHandle(targetHandle);
    if (!targetValidation.success) {
      return Result.fail(`Target handle: ${targetValidation.error}`);
    }

    return Result.ok(undefined);
  }
}
