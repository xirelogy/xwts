import * as LogTypes from '../bindings/LogTypes';


/**
 * May write log
 */
export interface XwLoggable {
  /**
   * Correspondent of console.log()
   */
  log: LogTypes.LogFunction;
  /**
   * Correspondent of console.info()
   */
  info: LogTypes.LogFunction;
  /**
   * Correspondent of console.warn()
   */
  warn: LogTypes.LogFunction;
  /**
   * Correspondent of console.error()
   */
  error: LogTypes.LogFunction;
  /**
   * Correspondent of console.debug()
   */
  debug: LogTypes.LogFunction;
  /**
   * Correspondent of console.group() with a scope
   */
  group: LogTypes.GroupFunction;
}