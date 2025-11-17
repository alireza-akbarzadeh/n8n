import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface SessionData {
  userId: string;
  sessionId: string;
  expiresAt: Date;
}

/**
 * Authentication Service
 *
 * Wraps better-auth functionality with domain-friendly interface
 */
export class AuthenticationService {
  /**
   * Get current session
   */
  async getCurrentSession(): Promise<Result<SessionData | null, string>> {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || !session.session || !session.user) {
        return Result.ok(null);
      }

      return Result.ok({
        userId: session.user.id,
        sessionId: session.session.id,
        expiresAt: new Date(session.session.expiresAt),
      });
    } catch (error) {
      logger.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to get current session'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to get current session');
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const sessionResult = await this.getCurrentSession();
    return sessionResult.success && sessionResult.data !== null;
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<Result<void, string>> {
    try {
      await auth.api.signOut({
        headers: await headers(),
      });
      return Result.ok(undefined);
    } catch (error) {
      logger.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to sign out'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to sign out');
    }
  }
}
