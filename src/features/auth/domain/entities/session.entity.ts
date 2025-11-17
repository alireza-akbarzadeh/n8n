import { BaseEntity } from '@/shared/domain/entities/base.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';
import { Result } from '@/core/types/common.types';

export interface SessionProps {
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Session Entity
 *
 * Represents an active user session
 */
export class Session extends BaseEntity<SessionProps> {
  private constructor(id: ID, props: SessionProps) {
    super(id, props);
  }

  /**
   * Create a new session
   */
  public static create(props: SessionProps, id?: ID): Result<Session, string> {
    // Validate user ID
    if (!props.userId || props.userId.trim().length === 0) {
      return Result.fail('User ID is required');
    }

    // Validate token
    if (!props.token || props.token.trim().length === 0) {
      return Result.fail('Token is required');
    }

    // Validate expiration
    if (props.expiresAt <= new Date()) {
      return Result.fail('Session expiration must be in the future');
    }

    const sessionId = id || ID.generate();
    const session = new Session(sessionId, {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });

    return Result.ok(session);
  }

  /**
   * Getters
   */
  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get ipAddress(): string | null {
    return this.props.ipAddress;
  }

  get userAgent(): string | null {
    return this.props.userAgent;
  }

  /**
   * Check if session is expired
   */
  public isExpired(): boolean {
    return this.props.expiresAt <= new Date();
  }

  /**
   * Check if session is valid
   */
  public isValid(): boolean {
    return !this.isExpired();
  }

  /**
   * Get remaining time in milliseconds
   */
  public getRemainingTime(): number {
    const now = new Date().getTime();
    const expiry = this.props.expiresAt.getTime();
    return Math.max(0, expiry - now);
  }
}
