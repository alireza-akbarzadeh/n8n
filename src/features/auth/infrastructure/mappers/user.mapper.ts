import type { User as PrismaUser } from '@/prisma/generated/prisma/client';
import { User } from '../../domain/entities/user.entity';
import { ID } from '@/shared/domain/value-objects/id.vo';

/**
 * User Mapper
 *
 * Maps between domain entities and Prisma models
 */
export class UserMapper {
  /**
   * Map Prisma model to domain entity
   */
  static toDomain(prismaUser: PrismaUser): User {
    const userResult = User.create(
      {
        email: prismaUser.email,
        name: prismaUser.name,
        emailVerified: prismaUser.emailVerified,
        image: prismaUser.image,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
      },
      ID.create(prismaUser.id)
    );

    if (!userResult.success) {
      throw new Error(`Failed to create user entity: ${userResult.error}`);
    }

    return userResult.data;
  }

  /**
   * Map domain entity to Prisma create input
   */
  static toPrismaCreate(user: User): {
    id: string;
    email: string | null;
    name: string | null;
    emailVerified: boolean;
    image: string | null;
  } {
    return {
      id: user.id.getValue(),
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      image: user.image,
    };
  }

  /**
   * Map domain entity to Prisma update input
   */
  static toPrismaUpdate(user: User): {
    email?: string | null;
    name?: string | null;
    emailVerified?: boolean;
    image?: string | null;
    updatedAt: Date;
  } {
    return {
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      image: user.image,
      updatedAt: user.updatedAt,
    };
  }
}
