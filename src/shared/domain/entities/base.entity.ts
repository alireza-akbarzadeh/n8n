import { ID } from '../value-objects/id.vo';

/**
 * Base Entity Class
 * All domain entities should extend this class
 */
export abstract class BaseEntity<T> {
  protected readonly _id: ID;
  protected readonly props: T;

  constructor(id: ID, props: T) {
    this._id = id;
    this.props = props;
  }

  get id(): ID {
    return this._id;
  }

  get createdAt(): Date {
    return (this.props as any).createdAt;
  }

  get updatedAt(): Date {
    return (this.props as any).updatedAt;
  }

  protected touch(): void {
    (this.props as any).updatedAt = new Date();
  }

  /**
   * Check equality based on ID
   */
  equals(entity: BaseEntity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id.equals(entity._id);
  }
}
