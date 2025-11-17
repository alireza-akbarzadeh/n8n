/**
 * Base Domain Event
 * All domain events should extend this class
 */
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
  }

  /**
   * Get event name (used for event routing)
   */
  abstract getEventName(): string;

  /**
   * Get event data
   */
  abstract getData(): Record<string, unknown>;
}

/**
 * Domain Event Handler Interface
 */
export interface IDomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}
