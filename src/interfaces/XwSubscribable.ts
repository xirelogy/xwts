import { XwReleasable } from './XwReleasable';


/**
 * Event callback function
 * @param payload Payload to the event
 */
type EventFunction<T> = (payload: T) => void;


/**
 * May subscribe
 */
export interface XwSubscribable<T> {
  /**
   * Subscribe to receive event
   * @param fn Receiver function
   * @returns Handle to release the event after use
   */
  subscribe(fn: EventFunction<T>): XwReleasable;
}