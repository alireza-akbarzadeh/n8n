import { BaseEntity } from '@/shared/domain/entities/base.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import { Result } from '@/core/types/common.types';

export interface UserProps {
  email: string | null;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User Aggregate Root
 *
 * Represents a user in the system with authentication and profile information
 */
export class User extends BaseEntity<UserProps> {
  private constructor(id: ID, props: UserProps) {
    super(id, props);
  }

  /**
   * Create a new user
   */
  public static create(props: UserProps, id?: ID): Result<User, string> {
    // Validate email if provided
    if (props.email) {
      const emailValidation = this.validateEmail(props.email);
      if (!emailValidation.success) {
        return Result.fail(emailValidation.error);
      }
    }

    // Validate name if provided
    if (props.name) {
      const nameValidation = this.validateName(props.name);
      if (!nameValidation.success) {
        return Result.fail(nameValidation.error);
      }
    }

    const userId = id || ID.generate();
    const user = new User(userId, {
      ...props,
      emailVerified: props.emailVerified ?? false,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });

    return Result.ok(user);
  }

  /**
   * Getters
   */
  get email(): string | null {
    return this.props.email;
  }

  get name(): string | null {
    return this.props.name;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get image(): string | null {
    return this.props.image;
  }

  /**
   * Update user profile
   */
  public updateProfile(data: {
    name?: string;
    email?: string;
    image?: string;
  }): Result<void, string> {
    if (data.email !== undefined) {
      if (data.email) {
        const emailValidation = User.validateEmail(data.email);
        if (!emailValidation.success) {
          return Result.fail(emailValidation.error);
        }
      }
      this.props.email = data.email;
    }

    if (data.name !== undefined) {
      if (data.name) {
        const nameValidation = User.validateName(data.name);
        if (!nameValidation.success) {
          return Result.fail(nameValidation.error);
        }
      }
      this.props.name = data.name;
    }

    if (data.image !== undefined) {
      this.props.image = data.image;
    }

    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Verify email
   */
  public verifyEmail(): Result<void, string> {
    if (!this.props.email) {
      return Result.fail('User has no email to verify');
    }

    this.props.emailVerified = true;
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Check if user has completed profile
   */
  public hasCompleteProfile(): boolean {
    return !!(this.props.email && this.props.name && this.props.emailVerified);
  }

  /**
   * Check if user can access premium features
   * Note: This is a placeholder - actual subscription check should be in a separate domain service
   */
  public isEmailVerified(): boolean {
    return this.props.emailVerified;
  }

  /**
   * Validate email format
   */
  private static validateEmail(email: string): Result<void, string> {
    if (!email || email.trim().length === 0) {
      return Result.fail('Email cannot be empty');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Result.fail('Invalid email format');
    }

    if (email.length > 255) {
      return Result.fail('Email cannot exceed 255 characters');
    }

    return Result.ok(undefined);
  }

  /**
   * Validate name
   */
  private static validateName(name: string): Result<void, string> {
    if (!name || name.trim().length === 0) {
      return Result.fail('Name cannot be empty');
    }

    if (name.length < 2) {
      return Result.fail('Name must be at least 2 characters');
    }

    if (name.length > 100) {
      return Result.fail('Name cannot exceed 100 characters');
    }

    return Result.ok(undefined);
  }
}
