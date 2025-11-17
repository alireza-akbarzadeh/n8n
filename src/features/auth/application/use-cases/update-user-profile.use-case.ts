import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Result } from '@/core/types/common.types';
import { logger } from '@/shared/infrastructure/logger/pino.logger';

export interface UpdateUserProfileInput {
  userId: string;
  name?: string;
  email?: string;
  image?: string;
  requestId?: string;
}

export interface UpdateUserProfileOutput {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  updatedAt: Date;
}

/**
 * Update User Profile Use Case
 *
 * Updates user profile information
 */
export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserProfileInput): Promise<Result<UpdateUserProfileOutput, string>> {
    const { userId, name, email, image, requestId } = input;

    logger.debug(
      {
        requestId,
        userId,
        updates: { name: !!name, email: !!email, image: !!image },
      },
      'Updating user profile'
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

      // Check if email is being changed and already exists
      if (email && email !== user.email) {
        const emailExists = await this.userRepository.existsByEmail(email);
        if (emailExists) {
          logger.warn(
            {
              requestId,
              userId,
              email,
            },
            'Email already in use'
          );
          return Result.fail('Email already in use');
        }
      }

      // Update profile
      const updateResult = user.updateProfile({ name, email, image });
      if (!updateResult.success) {
        logger.error(
          {
            requestId,
            userId,
            error: updateResult.error,
          },
          'Failed to update user profile'
        );
        return Result.fail(updateResult.error);
      }

      // Persist changes
      const updatedUser = await this.userRepository.update(user);

      logger.info(
        {
          requestId,
          userId,
        },
        'User profile updated'
      );

      return Result.ok({
        id: updatedUser.id.getValue(),
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.image,
        updatedAt: updatedUser.updatedAt,
      });
    } catch (error) {
      logger.error(
        {
          requestId,
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to update user profile'
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to update user profile');
    }
  }
}
