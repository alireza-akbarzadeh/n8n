import { BaseEntity } from '@/shared/domain/entities/base.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import { Result } from '@/core/types/common.types';

export enum NodeType {
  // Triggers
  INITIAL = 'INITIAL',
  MANUAL_TRIGGER = 'MANUAL_TRIGGER',
  WEBHOOK_TRIGGER = 'WEBHOOK_TRIGGER',
  SCHEDULE_TRIGGER = 'SCHEDULE_TRIGGER',
  EMAIL_TRIGGER = 'EMAIL_TRIGGER',

  // Actions
  HTTP_REQUEST = 'HTTP_REQUEST',
  SEND_EMAIL = 'SEND_EMAIL',
  DATABASE_QUERY = 'DATABASE_QUERY',

  // Transformations
  DATA_TRANSFORMER = 'DATA_TRANSFORMER',
  CODE_EXECUTOR = 'CODE_EXECUTOR',
  FILTER = 'FILTER',
  ROUTER = 'ROUTER',
  MERGE = 'MERGE',
  SPLIT = 'SPLIT',

  // Integrations
  GOOGLE_SHEETS = 'GOOGLE_SHEETS',
  SLACK = 'SLACK',
  GITHUB = 'GITHUB',
}

export interface Position {
  [key: string]: number;
  x: number;
  y: number;
}

export interface NodeProps {
  name: string;
  type: NodeType;
  workflowId: string;
  position: Position;
  data: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Node Entity
 *
 * Represents a single node in a workflow.
 * Contains node configuration and position.
 */
export class Node extends BaseEntity<NodeProps> {
  private constructor(id: ID, props: NodeProps) {
    super(id, props);
  }

  /**
   * Create a new node
   */
  public static create(props: NodeProps, id?: ID): Result<Node, string> {
    // Validate node name
    const nameValidation = this.validateName(props.name);
    if (!nameValidation.success) {
      return Result.fail(nameValidation.error!);
    }

    // Validate node type
    if (!Object.values(NodeType).includes(props.type)) {
      return Result.fail(`Invalid node type: ${props.type}`);
    }

    // Validate workflow ID
    if (!props.workflowId || props.workflowId.trim().length === 0) {
      return Result.fail('Workflow ID is required');
    }

    // Validate position
    const positionValidation = this.validatePosition(props.position);
    if (!positionValidation.success) {
      return Result.fail(positionValidation.error!);
    }

    const nodeId = id || ID.generate();
    const node = new Node(nodeId, {
      ...props,
      data: props.data || {},
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });

    return Result.ok(node);
  }

  /**
   * Getters
   */
  get name(): string {
    return this.props.name;
  }

  get type(): NodeType {
    return this.props.type;
  }

  get workflowId(): string {
    return this.props.workflowId;
  }

  get position(): Position {
    return this.props.position;
  }

  get data(): Record<string, unknown> {
    return this.props.data;
  }

  /**
   * Check if this is a trigger node
   */
  public isTrigger(): boolean {
    return [
      NodeType.INITIAL,
      NodeType.MANUAL_TRIGGER,
      NodeType.WEBHOOK_TRIGGER,
      NodeType.SCHEDULE_TRIGGER,
      NodeType.EMAIL_TRIGGER,
    ].includes(this.props.type);
  }

  /**
   * Check if this is an action node
   */
  public isAction(): boolean {
    return [NodeType.HTTP_REQUEST, NodeType.SEND_EMAIL, NodeType.DATABASE_QUERY].includes(
      this.props.type
    );
  }

  /**
   * Check if this is a transformation node
   */
  public isTransformation(): boolean {
    return [
      NodeType.DATA_TRANSFORMER,
      NodeType.CODE_EXECUTOR,
      NodeType.FILTER,
      NodeType.ROUTER,
      NodeType.MERGE,
      NodeType.SPLIT,
    ].includes(this.props.type);
  }

  /**
   * Check if this is an integration node
   */
  public isIntegration(): boolean {
    return [NodeType.GOOGLE_SHEETS, NodeType.SLACK, NodeType.GITHUB].includes(this.props.type);
  }

  /**
   * Update node name
   */
  public updateName(newName: string): Result<void, string> {
    const validation = Node.validateName(newName);
    if (!validation.success) {
      return Result.fail(validation.error!);
    }

    this.props.name = newName;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Update node position
   */
  public updatePosition(position: Position): Result<void, string> {
    const validation = Node.validatePosition(position);
    if (!validation.success) {
      return Result.fail(validation.error!);
    }

    this.props.position = position;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Update node data
   */
  public updateData(data: Record<string, unknown>): Result<void, string> {
    if (!data || typeof data !== 'object') {
      return Result.fail('Invalid node data');
    }

    this.props.data = data;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Merge node data (partial update)
   */
  public mergeData(partialData: Record<string, unknown>): Result<void, string> {
    if (!partialData || typeof partialData !== 'object') {
      return Result.fail('Invalid node data');
    }

    this.props.data = {
      ...this.props.data,
      ...partialData,
    };
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Validate node name
   */
  private static validateName(name: string): Result<void, string> {
    if (!name || name.trim().length === 0) {
      return Result.fail('Node name cannot be empty');
    }

    if (name.length > 100) {
      return Result.fail('Node name cannot exceed 100 characters');
    }

    return Result.ok(undefined);
  }

  /**
   * Validate node position
   */
  private static validatePosition(position: Position): Result<void, string> {
    if (!position) {
      return Result.fail('Node position is required');
    }

    if (typeof position.x !== 'number' || typeof position.y !== 'number') {
      return Result.fail('Position coordinates must be numbers');
    }

    if (position.x < 0 || position.y < 0) {
      return Result.fail('Position coordinates cannot be negative');
    }

    if (!isFinite(position.x) || !isFinite(position.y)) {
      return Result.fail('Position coordinates must be finite numbers');
    }

    return Result.ok(undefined);
  }

  /**
   * Rename the node (alias for updateName)
   */
  public rename(newName: string): Result<void, string> {
    return this.updateName(newName);
  }
}
