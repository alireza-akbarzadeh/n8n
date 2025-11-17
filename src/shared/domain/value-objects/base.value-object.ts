/**
 * Base Value Object Class
 * Value objects are immutable and compared by value, not identity
 */
export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(value: T) {
    this.validate(value);
    this.value = Object.freeze(value);
  }

  /**
   * Override this method to add validation logic
   */
  protected abstract validate(value: T): void;

  /**
   * Get the value
   */
  getValue(): T {
    return this.value;
  }

  /**
   * Check equality based on value
   */
  equals(vo: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (this === vo) {
      return true;
    }

    return JSON.stringify(this.value) === JSON.stringify(vo.value);
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return String(this.value);
  }
}
