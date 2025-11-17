import { BaseEntity } from '@/shared/domain/entities/base.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import { Result } from '@/core/types/common.types';
import { Node } from './node.entity';
import { Edge } from './edge.entity';

export interface WorkflowProps {
  name: string;
  userId: string;
  nodes: Node[];
  edges: Edge[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Workflow Aggregate Root
 *
 * Represents a workflow with nodes and edges.
 * Enforces business rules and invariants.
 */
export class Workflow extends BaseEntity<WorkflowProps> {
  private constructor(id: ID, props: WorkflowProps) {
    super(id, props);
  }

  /**
   * Create a new workflow
   */
  public static create(props: WorkflowProps, id?: ID): Result<Workflow, string> {
    // Validate workflow name
    const nameValidation = this.validateName(props.name);
    if (!nameValidation.success) {
      return Result.fail(nameValidation.error!);
    }

    // Validate user ID
    if (!props.userId || props.userId.trim().length === 0) {
      return Result.fail('User ID is required');
    }

    // Validate nodes and edges consistency
    const consistencyValidation = this.validateNodesAndEdges(props.nodes, props.edges);
    if (!consistencyValidation.success) {
      return Result.fail(consistencyValidation.error!);
    }

    const workflowId = id || ID.generate();
    const workflow = new Workflow(workflowId, {
      ...props,
      nodes: props.nodes || [],
      edges: props.edges || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });

    return Result.ok(workflow);
  }

  /**
   * Getters
   */
  get name(): string {
    return this.props.name;
  }

  get userId(): string {
    return this.props.userId;
  }

  get nodes(): Node[] {
    return this.props.nodes;
  }

  get edges(): Edge[] {
    return this.props.edges;
  }

  /**
   * Update workflow name
   */
  public updateName(newName: string): Result<void, string> {
    const validation = Workflow.validateName(newName);
    if (!validation.success) {
      return Result.fail(validation.error!);
    }

    this.props.name = newName;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Add a node to the workflow
   */
  public addNode(node: Node): Result<void, string> {
    // Check if node already exists
    const existingNode = this.props.nodes.find((n) => n.id.equals(node.id));
    if (existingNode) {
      return Result.fail(`Node with ID ${node.id.getValue()} already exists`);
    }

    // Validate that node belongs to this workflow
    if (node.workflowId !== this.id.getValue()) {
      return Result.fail('Node does not belong to this workflow');
    }

    this.props.nodes.push(node);
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Remove a node from the workflow
   */
  public removeNode(nodeId: ID): Result<void, string> {
    const nodeIndex = this.props.nodes.findIndex((n) => n.id.equals(nodeId));
    if (nodeIndex === -1) {
      return Result.fail(`Node with ID ${nodeId.getValue()} not found`);
    }

    // Remove the node
    this.props.nodes.splice(nodeIndex, 1);

    // Remove all edges connected to this node
    this.props.edges = this.props.edges.filter(
      (edge) => edge.sourceNodeId !== nodeId.getValue() && edge.targetNodeId !== nodeId.getValue()
    );

    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Add an edge to the workflow
   */
  public addEdge(edge: Edge): Result<void, string> {
    // Check if edge already exists
    const existingEdge = this.props.edges.find((e) => e.id.equals(edge.id));
    if (existingEdge) {
      return Result.fail(`Edge with ID ${edge.id.getValue()} already exists`);
    }

    // Validate that source and target nodes exist
    const sourceExists = this.props.nodes.some((n) => n.id.getValue() === edge.sourceNodeId);
    const targetExists = this.props.nodes.some((n) => n.id.getValue() === edge.targetNodeId);

    if (!sourceExists) {
      return Result.fail(`Source node ${edge.sourceNodeId} does not exist`);
    }

    if (!targetExists) {
      return Result.fail(`Target node ${edge.targetNodeId} does not exist`);
    }

    // Check for duplicate connections (same source, target, and handles)
    const duplicateConnection = this.props.edges.some(
      (e) =>
        e.sourceNodeId === edge.sourceNodeId &&
        e.targetNodeId === edge.targetNodeId &&
        e.sourceHandle === edge.sourceHandle &&
        e.targetHandle === edge.targetHandle
    );

    if (duplicateConnection) {
      return Result.fail('A connection with the same source and target already exists');
    }

    this.props.edges.push(edge);
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Remove an edge from the workflow
   */
  public removeEdge(edgeId: ID): Result<void, string> {
    const edgeIndex = this.props.edges.findIndex((e) => e.id.equals(edgeId));
    if (edgeIndex === -1) {
      return Result.fail(`Edge with ID ${edgeId.getValue()} not found`);
    }

    this.props.edges.splice(edgeIndex, 1);
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Update nodes and edges (bulk operation)
   */
  public updateNodesAndEdges(nodes: Node[], edges: Edge[]): Result<void, string> {
    // Validate consistency
    const validation = Workflow.validateNodesAndEdges(nodes, edges);
    if (!validation.success) {
      return Result.fail(validation.error!);
    }

    // Ensure all nodes belong to this workflow
    const invalidNodes = nodes.filter((n) => n.workflowId !== this.id.getValue());
    if (invalidNodes.length > 0) {
      return Result.fail('Some nodes do not belong to this workflow');
    }

    this.props.nodes = nodes;
    this.props.edges = edges;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Get all nodes connected to a specific node
   */
  public getConnectedNodes(nodeId: ID): Node[] {
    const connectedNodeIds = new Set<string>();

    // Find all edges connected to this node
    this.props.edges.forEach((edge) => {
      if (edge.sourceNodeId === nodeId.getValue()) {
        connectedNodeIds.add(edge.targetNodeId);
      }
      if (edge.targetNodeId === nodeId.getValue()) {
        connectedNodeIds.add(edge.sourceNodeId);
      }
    });

    // Return the nodes
    return this.props.nodes.filter((n) => connectedNodeIds.has(n.id.getValue()));
  }

  /**
   * Check if the workflow has cycles
   */
  public hasCycles(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = this.props.edges.filter((e) => e.sourceNodeId === nodeId);

      for (const edge of outgoingEdges) {
        if (!visited.has(edge.targetNodeId)) {
          if (dfs(edge.targetNodeId)) {
            return true;
          }
        } else if (recursionStack.has(edge.targetNodeId)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of this.props.nodes) {
      if (!visited.has(node.id.getValue())) {
        if (dfs(node.id.getValue())) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Validate workflow name
   */
  private static validateName(name: string): Result<void, string> {
    if (!name || name.trim().length === 0) {
      return Result.fail('Workflow name cannot be empty');
    }

    if (name.length < 2) {
      return Result.fail('Workflow name must be at least 2 characters');
    }

    if (name.length > 100) {
      return Result.fail('Workflow name cannot exceed 100 characters');
    }

    return Result.ok(undefined);
  }

  /**
   * Validate nodes and edges consistency
   */
  private static validateNodesAndEdges(nodes: Node[], edges: Edge[]): Result<void, string> {
    // Check if there are duplicate node IDs
    const nodeIds = nodes.map((n) => n.id.getValue());
    const uniqueNodeIds = new Set(nodeIds);
    if (nodeIds.length !== uniqueNodeIds.size) {
      return Result.fail('Duplicate node IDs detected');
    }

    // Check if all edges reference existing nodes
    for (const edge of edges) {
      const sourceExists = nodes.some((n) => n.id.getValue() === edge.sourceNodeId);
      const targetExists = nodes.some((n) => n.id.getValue() === edge.targetNodeId);

      if (!sourceExists) {
        return Result.fail(`Edge references non-existent source node: ${edge.sourceNodeId}`);
      }

      if (!targetExists) {
        return Result.fail(`Edge references non-existent target node: ${edge.targetNodeId}`);
      }
    }

    return Result.ok(undefined);
  }
}
