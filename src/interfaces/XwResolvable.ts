/**
 * Anything that can be resolved
 */
export interface XwResolvable<T> {
  /**
   * Access (resolve if necessary)
   */
  readonly r: T;
}