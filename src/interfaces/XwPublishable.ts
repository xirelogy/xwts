/**
 * May publish
 */
export interface XwPublishable<T> {
  /**
   * Publish event
   * @param payload Event payload
   */
  publish(payload: T): void;
}