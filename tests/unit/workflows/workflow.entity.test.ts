import { describe, it, expect, beforeEach } from 'vitest';
import { Workflow } from '../../../src/features/workflows/domain/entities/workflow.entity';
import { Node, NodeType } from '../../../src/features/workflows/domain/entities/node.entity';
import { Edge } from '../../../src/features/workflows/domain/entities/edge.entity';
import { ID } from '../../../src/shared/domain/value-objects/id.vo';

describe('Workflow Entity', () => {
  const userId = 'user-123';
  let workflow: Workflow;

  beforeEach(() => {
    const result = Workflow.create({
      name: 'Test Workflow',
      userId,
      nodes: [],
      edges: [],
    });
    expect(result.success).toBe(true);
    if (!result.success) throw new Error('Failed to create workflow');
    workflow = result.data;
  });

  describe('create', () => {
    it('should create a workflow with valid data', () => {
      const result = Workflow.create({
        name: 'My Workflow',
        userId: 'user-123',
        nodes: [],
        edges: [],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('My Workflow');
        expect(result.data.userId).toBe('user-123');
      }
    });

    it('should fail with empty name', () => {
      const result = Workflow.create({
        name: '',
        userId: 'user-123',
        nodes: [],
        edges: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('name');
      }
    });

    it('should fail with name too short', () => {
      const result = Workflow.create({
        name: 'a',
        userId: 'user-123',
        nodes: [],
        edges: [],
      });

      expect(result.success).toBe(false);
    });

    it('should fail with name too long', () => {
      const result = Workflow.create({
        name: 'a'.repeat(101),
        userId: 'user-123',
        nodes: [],
        edges: [],
      });

      expect(result.success).toBe(false);
    });

    it('should fail with empty userId', () => {
      const result = Workflow.create({
        name: 'Test',
        userId: '',
        nodes: [],
        edges: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('User ID');
      }
    });
  });

  describe('updateName', () => {
    it('should update workflow name', () => {
      const result = workflow.updateName('New Name');

      expect(result.success).toBe(true);
      expect(workflow.name).toBe('New Name');
    });

    it('should fail with invalid name', () => {
      const result = workflow.updateName('');

      expect(result.success).toBe(false);
      expect(workflow.name).toBe('Test Workflow'); // Name unchanged
    });
  });

  describe('addNode', () => {
    it('should add a node to workflow', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });

      expect(nodeResult.success).toBe(true);
      if (!nodeResult.success) throw new Error('Failed to create node');
      const node = nodeResult.data;

      const result = workflow.addNode(node);

      expect(result.success).toBe(true);
      expect(workflow.nodes).toHaveLength(1);
      expect(workflow.nodes[0].id.equals(node.id)).toBe(true);
    });

    it('should fail when adding duplicate node', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });

      if (!nodeResult.success) throw new Error('Failed to create node');
      const node = nodeResult.data;
      workflow.addNode(node);

      const result = workflow.addNode(node);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('already exists');
      }
      expect(workflow.nodes).toHaveLength(1);
    });
  });

  describe('removeNode', () => {
    it('should remove a node from workflow', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });

      if (!nodeResult.success) throw new Error('Failed to create node');
      const node = nodeResult.data;
      workflow.addNode(node);

      const result = workflow.removeNode(node.id);

      expect(result.success).toBe(true);
      expect(workflow.nodes).toHaveLength(0);
    });

    it('should fail when removing non-existent node', () => {
      const nonExistentId = ID.generate();
      const result = workflow.removeNode(nonExistentId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });

    it('should remove connected edges when removing node', () => {
      // Create two nodes
      const node1Result = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });
      const node2Result = Node.create({
        type: NodeType.HTTP_REQUEST,
        name: 'HTTP',
        workflowId: workflow.id.getValue(),
        position: { x: 100, y: 100 },
        data: {},
      });

      if (!node1Result.success) throw new Error('Failed to create node1');
      if (!node2Result.success) throw new Error('Failed to create node2');
      const node1 = node1Result.data;
      const node2 = node2Result.data;

      workflow.addNode(node1);
      workflow.addNode(node2);

      // Add edge between them
      const edgeResult = Edge.create({
        sourceNodeId: node1.id.getValue(),
        targetNodeId: node2.id.getValue(),
        workflowId: workflow.id.getValue(),
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      if (!edgeResult.success) throw new Error('Failed to create edge');
      workflow.addEdge(edgeResult.data);

      expect(workflow.edges).toHaveLength(1);

      // Remove node1
      workflow.removeNode(node1.id);

      // Edge should be removed
      expect(workflow.edges).toHaveLength(0);
      expect(workflow.nodes).toHaveLength(1);
    });
  });

  describe('addEdge', () => {
    let node1: Node;
    let node2: Node;

    beforeEach(() => {
      const node1Result = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });
      const node2Result = Node.create({
        type: NodeType.HTTP_REQUEST,
        name: 'HTTP',
        workflowId: workflow.id.getValue(),
        position: { x: 100, y: 100 },
        data: {},
      });

      if (!node1Result.success) throw new Error('Failed to create node1');
      if (!node2Result.success) throw new Error('Failed to create node2');
      node1 = node1Result.data;
      node2 = node2Result.data;

      workflow.addNode(node1);
      workflow.addNode(node2);
    });

    it('should add an edge to workflow', () => {
      const edgeResult = Edge.create({
        sourceNodeId: node1.id.getValue(),
        targetNodeId: node2.id.getValue(),
        workflowId: workflow.id.getValue(),
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      if (!edgeResult.success) throw new Error('Failed to create edge');
      const edge = edgeResult.data;
      const result = workflow.addEdge(edge);

      expect(result.success).toBe(true);
      expect(workflow.edges).toHaveLength(1);
    });

    it('should fail when adding duplicate edge', () => {
      const edgeResult = Edge.create({
        sourceNodeId: node1.id.getValue(),
        targetNodeId: node2.id.getValue(),
        workflowId: workflow.id.getValue(),
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      if (!edgeResult.success) throw new Error('Failed to create edge');
      const edge = edgeResult.data;
      workflow.addEdge(edge);

      const result = workflow.addEdge(edge);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('already exists');
      }
    });

    it('should fail when source node does not exist', () => {
      const nonExistentId = ID.generate();
      const edgeResult = Edge.create({
        sourceNodeId: nonExistentId.getValue(),
        targetNodeId: node2.id.getValue(),
        workflowId: workflow.id.getValue(),
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      if (!edgeResult.success) throw new Error('Failed to create edge');
      const edge = edgeResult.data;
      const result = workflow.addEdge(edge);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Source node');
      }
    });

    it('should fail when target node does not exist', () => {
      const nonExistentId = ID.generate();
      const edgeResult = Edge.create({
        sourceNodeId: node1.id.getValue(),
        targetNodeId: nonExistentId.getValue(),
        workflowId: workflow.id.getValue(),
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      if (!edgeResult.success) throw new Error('Failed to create edge');
      const edge = edgeResult.data;
      const result = workflow.addEdge(edge);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Target node');
      }
    });
  });

  describe('removeEdge', () => {
    let node1: Node;
    let node2: Node;
    let edge: Edge;

    beforeEach(() => {
      const node1Result = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });
      const node2Result = Node.create({
        type: NodeType.HTTP_REQUEST,
        name: 'HTTP',
        workflowId: workflow.id.getValue(),
        position: { x: 100, y: 100 },
        data: {},
      });

      if (!node1Result.success) throw new Error('Failed to create node1');
      if (!node2Result.success) throw new Error('Failed to create node2');
      node1 = node1Result.data;
      node2 = node2Result.data;

      workflow.addNode(node1);
      workflow.addNode(node2);

      const edgeResult = Edge.create({
        sourceNodeId: node1.id.getValue(),
        targetNodeId: node2.id.getValue(),
        workflowId: workflow.id.getValue(),
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      if (!edgeResult.success) throw new Error('Failed to create edge');
      edge = edgeResult.data;
      workflow.addEdge(edge);
    });

    it('should remove an edge from workflow', () => {
      const result = workflow.removeEdge(edge.id);

      expect(result.success).toBe(true);
      expect(workflow.edges).toHaveLength(0);
    });

    it('should fail when removing non-existent edge', () => {
      const nonExistentId = ID.generate();
      const result = workflow.removeEdge(nonExistentId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('hasNode', () => {
    it('should return true for existing node', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });

      if (!nodeResult.success) throw new Error('Failed to create node');
      const node = nodeResult.data;
      workflow.addNode(node);

      expect(workflow.hasNode(node.id)).toBe(true);
    });

    it('should return false for non-existent node', () => {
      const nonExistentId = ID.generate();
      expect(workflow.hasNode(nonExistentId)).toBe(false);
    });
  });

  describe('getNodeById', () => {
    it('should return node when it exists', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: workflow.id.getValue(),
        position: { x: 0, y: 0 },
        data: {},
      });

      if (!nodeResult.success) throw new Error('Failed to create node');
      const node = nodeResult.data;
      workflow.addNode(node);

      const foundNode = workflow.getNodeById(node.id);

      expect(foundNode).toBeDefined();
      expect(foundNode?.id.equals(node.id)).toBe(true);
    });

    it('should return undefined when node does not exist', () => {
      const nonExistentId = ID.generate();
      const foundNode = workflow.getNodeById(nonExistentId);

      expect(foundNode).toBeUndefined();
    });
  });
});
