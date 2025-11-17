import { describe, it, expect } from 'vitest';
import {
  Execution,
  ExecutionStatus,
  ExecutionMode,
} from '../../../src/features/executions/domain/entities/execution.entity';

describe('Execution Entity', () => {
  describe('create', () => {
    it('should create an execution with valid data', () => {
      const result = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.PENDING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.workflowId).toBe('workflow-123');
        expect(result.data.status).toBe(ExecutionStatus.PENDING);
      }
    });

    it('should fail with empty workflow ID', () => {
      const result = Execution.create({
        workflowId: '',
        userId: 'user-123',
        status: ExecutionStatus.PENDING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Workflow ID');
      }
    });

    it('should fail with empty user ID', () => {
      const result = Execution.create({
        workflowId: 'workflow-123',
        userId: '',
        status: ExecutionStatus.PENDING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('User ID');
      }
    });
  });

  describe('start', () => {
    it('should start a pending execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.PENDING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      execution.start();

      expect(execution.status).toBe(ExecutionStatus.RUNNING);
    });

    it('should throw error when starting non-pending execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.RUNNING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;

      expect(() => execution.start()).toThrow();
    });
  });

  describe('complete', () => {
    it('should complete a running execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.RUNNING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      execution.complete();

      expect(execution.status).toBe(ExecutionStatus.SUCCESS);
      expect(execution.finishedAt).toBeDefined();
      expect(execution.duration).toBeGreaterThanOrEqual(0);
    });

    it('should throw error when completing non-running execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.PENDING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;

      expect(() => execution.complete()).toThrow();
    });
  });

  describe('fail', () => {
    it('should fail a running execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.RUNNING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      execution.fail('Test error', 'Stack trace');

      expect(execution.status).toBe(ExecutionStatus.FAILED);
      expect(execution.error).toBe('Test error');
      expect(execution.errorStack).toBe('Stack trace');
      expect(execution.finishedAt).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('should cancel a running execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.RUNNING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      execution.cancel();

      expect(execution.status).toBe(ExecutionStatus.CANCELLED);
      expect(execution.finishedAt).toBeDefined();
    });
  });

  describe('isFinished', () => {
    it('should return true for finished execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.SUCCESS,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      expect(execution.isFinished()).toBe(true);
    });

    it('should return false for running execution', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.RUNNING,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      expect(execution.isFinished()).toBe(false);
    });
  });

  describe('getFormattedDuration', () => {
    it('should format duration in milliseconds', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.SUCCESS,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
        duration: 500,
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      expect(execution.getFormattedDuration()).toBe('500ms');
    });

    it('should format duration in seconds', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.SUCCESS,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
        duration: 45000, // 45 seconds
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      expect(execution.getFormattedDuration()).toBe('45s');
    });

    it('should format duration in minutes and seconds', () => {
      const executionResult = Execution.create({
        workflowId: 'workflow-123',
        userId: 'user-123',
        status: ExecutionStatus.SUCCESS,
        mode: ExecutionMode.MANUAL,
        startedAt: new Date(),
        duration: 125000, // 2m 5s
      });

      if (!executionResult.success) throw new Error('Failed to create execution');
      const execution = executionResult.data;
      expect(execution.getFormattedDuration()).toBe('2m 5s');
    });
  });
});
