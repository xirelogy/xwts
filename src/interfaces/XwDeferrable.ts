/**
 * Options for wait() method
 */
export interface XwDeferrableWaitOptions<T> {
  /**
   * Timeout in milliseconds - if specified, wait() will return after this duration
   * even if notify() hasn't been called
   */
  timeoutMs?: number;

  /**
   * Default return value when wait() returns due to timeout (without notify being called)
   * Default is undefined
   */
  defaultReturn?: T;
}


/**
 * A deferrable interface that allows asynchronous waiting for a notification
 * Similar to a manual-reset event or a one-time signal
 */
export interface XwDeferrable<T = void> {
  /**
   * Wait asynchronously until notify() is called or timeout occurs
   * @param options Optional wait options (timeout, default return value)
   * @returns Promise that resolves with the notified value or default value on timeout
   */
  wait(options?: XwDeferrableWaitOptions<T>): Promise<T>;

  /**
   * Notify and resolve all waiting promises with the given value
   * @param value The value to pass to all waiting promises
   */
  notify(value: T): void;

  /**
   * Reset the deferrable to its initial state, allowing it to be reused
   * This clears the notified state and cached value, making it ready for a new wait/notify cycle
   */
  reset(): void;
}
