import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import prisma from '@/shared/infrastructure/database/db';
import { UserMapper } from '../mappers/user.mapper';

/**
 * Prisma User Repository
 *
 * Implements IUserRepository using Prisma ORM
 */
export class PrismaUserRepository implements IUserRepository {
  private readonly db = prisma;

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.db.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.db.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Create a new user
   */
  async create(user: User): Promise<User> {
    const data = UserMapper.toPrismaCreate(user);

    const prismaUser = await this.db.user.create({
      data,
    });

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Update an existing user
   */
  async update(user: User): Promise<User> {
    const data = UserMapper.toPrismaUpdate(user);

    const prismaUser = await this.db.user.update({
      where: { id: user.id.getValue() },
      data,
    });

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    await this.db.user.delete({
      where: { id },
    });
  }

  /**
   * Check if a user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.db.user.count({
      where: { email },
    });
    return count > 0;
  }
}
