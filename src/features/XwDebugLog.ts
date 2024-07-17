import { _used } from '../sugar';

import {
  jsGlobalStoreAccess,
} from '../compat/JsGlobalStorage';

import {
  type XwDebugLogCheckFunction,
  XwDebugLogStorage,
} from '../internals/XwDebugLogStorage';

import { XwLoggable } from '../interfaces/XwLoggable';
import { XwResolvable } from '../interfaces/XwResolvable';
import { XwDummyLoggerCreator } from '../classes/XwDummyLoggerCreator';
import { XwPrefixedLoggerCreator } from '../classes/XwPrefixedLoggerCreator';
import { XwResolveUsing } from '../classes/XwResolveUsing';

import xw from '../Xw';


/**
 * Access to storage
 * @returns 
 */
function _getXwDebugLogStorage(): XwDebugLogStorage {
  return jsGlobalStoreAccess('XwDebugLogStorage', () => new XwDebugLogStorage());
}


/**
 * Debug log support
 */
class XwDebugLog {
  /**
   * Define a logging source
   * @param source Debug source
   * @param base Specific log base (sink)
   * @returns Corresponding log interface
   */
  define(source: string, base?: XwLoggable): XwLoggable {
    const _creator = this.isLog(source) ? new XwPrefixedLoggerCreator(source) : new XwDummyLoggerCreator();
    return _creator.createLogger(base ?? xw.logger);
  }


  /**
   * Define a logging source (lazy)
   * @param source Debug source
   * @param base Specific log base (sink)
   * @returns Corresponding log interface resolver
   */
  defineLazy(source: string, base?: XwLoggable): XwResolvable<XwLoggable> {
    return new XwResolveUsing(() => {
      return this.define(source, base);
    });
  }


  /**
   * Check if logging enabled
   * @param source Debug source
   * @returns
   */
  isLog(source: string): boolean {
    return _getXwDebugLogStorage().isLog(source);
  }


  /**
   * Define the check function
   * @param fn 
   */
  check(fn: XwDebugLogCheckFunction): void {
    _getXwDebugLogStorage().defineCheck(fn);
  }
}

const xwDebugLog = new XwDebugLog();
export default xwDebugLog;