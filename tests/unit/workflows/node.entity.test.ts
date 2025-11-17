import { describe, it, expect } from 'vitest';
import { Node, NodeType } from '../../../src/features/workflows/domain/entities/node.entity';

describe('Node Entity', () => {
  describe('create', () => {
    it('should create a node with valid data', () => {
      const result = Node.create({
        type: NodeType.INITIAL,
        name: 'Start Node',
        workflowId: 'workflow-123',
        position: { x: 100, y: 200 },
        data: { key: 'value' },
      });

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe(NodeType.INITIAL);
      expect(result.data?.name).toBe('Start Node');
      expect(result.data?.position).toEqual({ x: 100, y: 200 });
    });

    it('should fail with empty name', () => {
      const result = Node.create({
        type: NodeType.INITIAL,
        name: '',
        workflowId: 'workflow-123',
        position: { x: 0, y: 0 },
        data: {},
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('name');
    });

    it('should fail with empty workflow ID', () => {
      const result = Node.create({
        type: NodeType.INITIAL,
        name: 'Test',
        workflowId: '',
        position: { x: 0, y: 0 },
        data: {},
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Workflow ID');
    });
  });

  describe('updatePosition', () => {
    it('should update node position', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: 'workflow-123',
        position: { x: 0, y: 0 },
        data: {},
      });

      const node = nodeResult.data!;
      const result = node.updatePosition({ x: 50, y: 100 });

      expect(result.success).toBe(true);
      expect(node.position).toEqual({ x: 50, y: 100 });
    });

    it('should fail with negative position', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: 'workflow-123',
        position: { x: 0, y: 0 },
        data: {},
      });

      const node = nodeResult.data!;
      const result = node.updatePosition({ x: -10, y: 20 });

      expect(result.success).toBe(false);
      expect(node.position).toEqual({ x: 0, y: 0 }); // Position unchanged
    });
  });

  describe('updateData', () => {
    it('should update node data', () => {
      const nodeResult = Node.create({
        type: NodeType.HTTP_REQUEST,
        name: 'HTTP',
        workflowId: 'workflow-123',
        position: { x: 0, y: 0 },
        data: { url: 'https://api.example.com' },
      });

      const node = nodeResult.data!;
      node.updateData({ url: 'https://newapi.example.com', method: 'POST' });

      expect(node.data).toEqual({ url: 'https://newapi.example.com', method: 'POST' });
    });

    it('should merge data when updating', () => {
      const nodeResult = Node.create({
        type: NodeType.HTTP_REQUEST,
        name: 'HTTP',
        workflowId: 'workflow-123',
        position: { x: 0, y: 0 },
        data: { url: 'https://api.example.com', timeout: 5000 },
      });

      const node = nodeResult.data!;
      node.mergeData({ method: 'POST' });

      expect(node.data).toEqual({
        url: 'https://api.example.com',
        timeout: 5000,
        method: 'POST',
      });
    });
  });

  describe('rename', () => {
    it('should rename the node', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: 'workflow-123',
        position: { x: 0, y: 0 },
        data: {},
      });

      const node = nodeResult.data!;
      const result = node.rename('New Start');

      expect(result.success).toBe(true);
      expect(node.name).toBe('New Start');
    });

    it('should fail with empty name', () => {
      const nodeResult = Node.create({
        type: NodeType.INITIAL,
        name: 'Start',
        workflowId: 'workflow-123',
        position: { x: 0, y: 0 },
        data: {},
      });

      const node = nodeResult.data!;
      const result = node.rename('');

      expect(result.success).toBe(false);
      expect(node.name).toBe('Start'); // Name unchanged
    });
  });
});
