import { describe, it, expect } from 'vitest';
import { User } from '../../../src/features/auth/domain/entities/user.entity';
import { ID } from '../../../src/shared/domain/value-objects/id.vo';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with valid data', () => {
      const result = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: false,
        image: null,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.name).toBe('Test User');
        expect(result.data.emailVerified).toBe(false);
      }
    });

    it('should fail with invalid email format', () => {
      const result = User.create({
        email: 'invalid-email',
        name: 'Test User',
        emailVerified: false,
        image: null,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('email');
      }
    });

    it('should fail with email too long', () => {
      const result = User.create({
        email: 'a'.repeat(250) + '@example.com',
        name: 'Test User',
        emailVerified: false,
        image: null,
      });

      expect(result.success).toBe(false);
    });

    it('should fail with name too short', () => {
      const result = User.create({
        email: 'test@example.com',
        name: 'a',
        emailVerified: false,
        image: null,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Name must be at least');
      }
    });

    it('should fail with name too long', () => {
      const result = User.create({
        email: 'test@example.com',
        name: 'a'.repeat(101),
        emailVerified: false,
        image: null,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update profile with valid data', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: false,
        image: null,
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      const result = user.updateProfile({
        name: 'Updated Name',
        email: 'updated@example.com',
      });

      expect(result.success).toBe(true);
      expect(user.name).toBe('Updated Name');
      expect(user.email).toBe('updated@example.com');
    });

    it('should fail with invalid email', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: false,
        image: null,
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      const result = user.updateProfile({ email: 'invalid-email' });

      expect(result.success).toBe(false);
      expect(user.email).toBe('test@example.com'); // Email unchanged
    });

    it('should update only provided fields', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: false,
        image: 'https://example.com/old.jpg',
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      user.updateProfile({ image: 'https://example.com/new.jpg' });

      expect(user.image).toBe('https://example.com/new.jpg');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
    });
  });

  describe('verifyEmail', () => {
    it('should mark email as verified', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: false,
        image: null,
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      user.verifyEmail();

      expect(user.emailVerified).toBe(true);
    });
  });

  describe('hasCompleteProfile', () => {
    it('should return true when profile is complete', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: true,
        image: 'https://example.com/avatar.jpg',
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      expect(user.hasCompleteProfile()).toBe(true);
    });

    it('should return false when email is not verified', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: false,
        image: 'https://example.com/avatar.jpg',
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      expect(user.hasCompleteProfile()).toBe(false);
    });

    it('should return false when name is missing', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: '',
        emailVerified: true,
        image: null,
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      expect(user.hasCompleteProfile()).toBe(false);
    });
  });

  describe('isEmailVerified', () => {
    it('should return true when email is verified', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: true,
        image: null,
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      expect(user.isEmailVerified()).toBe(true);
    });

    it('should return false when email is not verified', () => {
      const userResult = User.create({
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: false,
        image: null,
      });

      if (!userResult.success) throw new Error("Expected success");
      const user = userResult.data;
      expect(user.isEmailVerified()).toBe(false);
    });
  });
});
