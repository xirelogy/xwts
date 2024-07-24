/**
 * Storage handle
 */
export interface XwStorageHandleable<T> {
  /**
   * Load from storage
   */
  load(): T|undefined;

  /**
   * Save into storage
   * @param value Value to be stored
   */
  save(value: T): void;

  /**
   * Remove value stored
   */
  clear(): void;
}