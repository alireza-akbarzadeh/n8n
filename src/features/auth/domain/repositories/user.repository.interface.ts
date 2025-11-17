import { User } from '../entities/user.entity';

/**
 * User Repository Interface
 *
 * Defines the contract for user persistence
 */
export interface IUserRepository {
  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user
   */
  create(user: User): Promise<User>;

  /**
   * Update an existing user
   */
  update(user: User): Promise<User>;

  /**
   * Delete a user
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a user exists by email
   */
  existsByEmail(email: string): Promise<boolean>;
}
