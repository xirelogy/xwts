import xw from '../Xw';
import { XwOneTimeRelease } from './XwOneTimeRelease';
import { XwPublishable } from '../interfaces/XwPublishable';
import { XwReleasable } from '../interfaces/XwReleasable';
import { XwSubscribable } from '../interfaces/XwSubscribable';


/*
 * Event callback function
 * @param payload Payload to the event
 */
type EventFunction<T> = (payload: T) => void;


/**
 * Event broker
 */
export class XwEventBroker<T> implements XwPublishable<T> {
  /**
   * All receivers
   */
  private _receivers: Record<string, EventFunction<T>>;


  /**
   * @constructor
   */
  constructor() {
    this._receivers = {};
  }


  /**
   * @inheritdoc
   */
  publish(payload: T): void {
    for (const key in this._receivers) {
      const receiver = this._receivers[key] as EventFunction<T>;
      try {
        receiver(payload);
      } catch (e) {
        // nop
      }
    }
  }


  /**
   * Expose subscription interface
   * @returns
   */
  expose(): XwSubscribable<T> {
    return {
      /**
       * @inheritdoc
       */
      subscribe: (fn: EventFunction<T>): XwReleasable => {
        const key = xw.random.lowerAlphanumString(8);
        this._receivers[key] = fn;

        return new XwOneTimeRelease(() => {
          delete this._receivers[key];
        });
      },
    };
  }
}
