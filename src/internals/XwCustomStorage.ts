import { XwStorageHandleable } from '../interfaces/XwStorageHandleable';


/**
 * Internal custom storage
 */
export class XwCustomStorage {
  /**
   * Values map
   */
  private _values = new Map<string|Symbol, any>();


  /**
   * Create access interface to a particular key in custom storage
   * @param key
   * @returns Storage handle
   */
  access<T>(key: string|Symbol): XwStorageHandleable<T> {
    const _thisValues = this._values;

    return {
      /**
       * @inheritdoc
       */
      load() {
        return _thisValues.get(key) as T|undefined;
      },

      /**
       * @inheritdoc
       */
      save(value: T) {
        _thisValues.set(key, value);
      },

      /**
       * @inheritdoc
       */
      clear() {
        _thisValues.delete(key);
      }
    };
  }
};