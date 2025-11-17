import { describe, it, expect } from 'vitest';
import { Edge } from '../../../src/features/workflows/domain/entities/edge.entity';

describe('Edge Entity', () => {
  describe('create', () => {
    it('should create an edge with valid data', () => {
      const result = Edge.create({
        sourceNodeId: 'node-1',
        targetNodeId: 'node-2',
        workflowId: 'workflow-123',
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sourceNodeId).toBe('node-1');
        expect(result.data.targetNodeId).toBe('node-2');
        expect(result.data.sourceHandle).toBe('main');
        expect(result.data.targetHandle).toBe('main');
      }
    });

    it('should create an edge with custom handles', () => {
      const result = Edge.create({
        sourceNodeId: 'node-1',
        targetNodeId: 'node-2',
        workflowId: 'workflow-123',
        sourceHandle: 'output1',
        targetHandle: 'input1',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sourceHandle).toBe('output1');
        expect(result.data.targetHandle).toBe('input1');
      }
    });

    it('should fail with empty source node ID', () => {
      const result = Edge.create({
        sourceNodeId: '',
        targetNodeId: 'node-2',
        workflowId: 'workflow-123',
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Source node ID');
      }
    });

    it('should fail with empty target node ID', () => {
      const result = Edge.create({
        sourceNodeId: 'node-1',
        targetNodeId: '',
        workflowId: 'workflow-123',
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Target node ID');
      }
    });

    it('should fail with same source and target', () => {
      const result = Edge.create({
        sourceNodeId: 'node-1',
        targetNodeId: 'node-1',
        workflowId: 'workflow-123',
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('must be different');
      }
    });

    it('should fail with empty workflow ID', () => {
      const result = Edge.create({
        sourceNodeId: 'node-1',
        targetNodeId: 'node-2',
        workflowId: '',
        sourceHandle: 'main',
        targetHandle: 'main',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Workflow ID');
      }
    });
  });
});
