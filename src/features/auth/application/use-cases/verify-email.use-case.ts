import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface VerifyEmailInput {
  userId: string;
  requestId?: string;
}

export interface VerifyEmailOutput {
  id: string;
  email: string | null;
  emailVerified: boolean;
}

/**
 * Verify Email Use Case
 *
 * Marks user's email as verified
 */
export class VerifyEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: VerifyEmailInput): Promise<Result<VerifyEmailOutput, string>> {
    const { userId, requestId } = input;

    logger.debug(
      {
        requestId,
        userId,
      },
      'Verifying user email'
    );

    try {
      // Fetch user
      const user = await this.userRepository.findById(userId);

      if (!user) {
        logger.warn(
          {
            requestId,
            userId,
          },
          'User not found'
        );
        return Result.fail('User not found');
      }

      // Verify email
      const verifyResult = user.verifyEmail();
      if (!verifyResult.success) {
        logger.error(
          {
            requestId,
            userId,
            error: verifyResult.error,
          },
          'Failed to verify email'
        );
        return Result.fail(verifyResult.error);
      }

      // Persist changes
      const updatedUser = await this.userRepository.update(user);

      logger.info(
        {
          requestId,
          userId,
          email: updatedUser.email,
        },
        'User email verified'
      );

      return Result.ok({
        id: updatedUser.id.getValue(),
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to verify email'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to verify email');
    }
  }
}
