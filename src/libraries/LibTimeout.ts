import { XwTimeoutError } from '../classes/XwTimeoutError';


export default class LibTimeout {
  /**
   * Raise rejection when timeout
   * @param reject Rejection function
   * @param timeoutMs Timeout in MS, if specified
   * @param fn Optional execution when timeout
   * @returns If the listener installed
   */
  static rejectOnTimeout(reject: (reason?: any) => void, timeoutMs: number|null, fn?: () => void): boolean {
    if (timeoutMs === null) return false;
    if (timeoutMs <= 0) return false;

    setTimeout(() => {
      if (fn) fn();
      reject(new XwTimeoutError());
    }, timeoutMs);

    return true;
  }
}