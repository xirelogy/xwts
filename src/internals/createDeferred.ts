import { XwDeferrable, XwDeferrableWaitOptions } from '../interfaces/XwDeferrable';


/**
 * Internal implementation of XwDeferrable
 */
class XwDeferrableImpl<T> implements XwDeferrable<T> {
  /**
   * Queue of resolve functions waiting to be notified
   */
  private _resolvers: Array<(value: T) => void> = [];

  /**
   * Whether notify() has been called
   */
  private _isNotified = false;

  /**
   * The value passed to notify() (cached for late subscribers)
   */
  private _notifiedValue: T | undefined = undefined;


  /**
   * @inheritdoc
   */
  wait(options?: XwDeferrableWaitOptions<T>): Promise<T> {
    // If already notified, return immediately
    if (this._isNotified) {
      return Promise.resolve(this._notifiedValue as T);
    }

    return new Promise<T>((resolve) => {
      let isResolved = false;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      // Add resolver to queue
      const resolver = (value: T) => {
        if (!isResolved) {
          isResolved = true;
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }
          resolve(value);
        }
      };

      this._resolvers.push(resolver);

      // Set up timeout if specified
      if (options?.timeoutMs !== undefined && options.timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            // Remove resolver from queue
            const index = this._resolvers.indexOf(resolver);
            if (index > -1) {
              this._resolvers.splice(index, 1);
            }
            resolve(options.defaultReturn as T);
          }
        }, options.timeoutMs);
      }
    });
  }


  /**
   * @inheritdoc
   */
  notify(value: T): void {
    if (this._isNotified) {
      console.warn('XwDeferrable: notify() called multiple times - ignoring subsequent calls');
      return;
    }

    this._isNotified = true;
    this._notifiedValue = value;

    // Resolve all waiting promises
    const resolvers = this._resolvers.splice(0);
    for (const resolver of resolvers) {
      try {
        resolver(value);
      } catch (e) {
        // Ignore errors in resolvers
        console.error('XwDeferrable: Error in resolver', e);
      }
    }
  }


  /**
   * @inheritdoc
   */
  reset(): void {
    this._isNotified = false;
    this._notifiedValue = undefined;
    // Note: We don't clear pending resolvers as they may still be waiting
    // If someone calls reset() while there are pending wait() calls, those will never resolve
    // This is intentional - reset() should only be called when you know all operations are complete
    if (this._resolvers.length > 0) {
      console.warn('XwDeferrable: reset() called with pending resolvers - these promises will never resolve');
    }
  }
}


/**
 * Create a deferrable object that allows asynchronous waiting for a notification
 * @returns A new XwDeferrable instance
 */
export default function createDeferred<T = void>(): XwDeferrable<T> {
  return new XwDeferrableImpl<T>();
}
