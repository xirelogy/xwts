import { XwLoggable } from './XwLoggable';


/**
 * May create logger instance
 */
export interface XwLoggerCreatable {
  /**
   * Create a logger
   * @param base Logger to be based upon, if applicable
   * @returns Created logger
   */
  createLogger(base?: XwLoggable): XwLoggable;
}