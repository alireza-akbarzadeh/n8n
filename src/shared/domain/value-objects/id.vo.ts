import { ValueObject } from './base.value-object';
import { createId } from '@paralleldrive/cuid2';

/**
 * ID Value Object
 * Represents a unique identifier
 */
export class ID extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('ID cannot be empty');
    }
  }

  /**
   * Create an ID from an existing value
   */
  static create(value: string): ID {
    return new ID(value);
  }

  /**
   * Generate a new unique ID
   */
  static generate(): ID {
    return new ID(createId());
  }
}
