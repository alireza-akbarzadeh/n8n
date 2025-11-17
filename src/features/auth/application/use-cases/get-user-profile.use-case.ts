import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface GetUserProfileInput {
  userId: string;
  requestId?: string;
}

export interface UserProfileOutput {
  id: string;
  email: string | null;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  hasCompleteProfile: boolean;
  createdAt: Date;
}

/**
 * Get User Profile Use Case
 *
 * Retrieves user profile information
 */
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserProfileInput): Promise<Result<UserProfileOutput, string>> {
    const { userId, requestId } = input;

    logger.debug(
      {
        requestId,
        userId,
      },
      'Fetching user profile'
    );

    try {
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

      logger.info(
        {
          requestId,
          userId,
        },
        'User profile retrieved'
      );

      return Result.ok({
        id: user.id.getValue(),
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
        hasCompleteProfile: user.hasCompleteProfile(),
        createdAt: user.createdAt,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to get user profile'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to get user profile');
    }
  }
}
