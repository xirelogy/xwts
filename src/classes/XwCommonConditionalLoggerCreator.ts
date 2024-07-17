import xwConsoleLogger from '../features/XwConsoleLogger';
import { XwLoggable } from '../interfaces/XwLoggable';
import { XwLoggerCreatable } from '../interfaces/XwLoggerCreatable';


/**
 * Dummy log function
 */
function _dummyLog() {

}


/**
 * Dummy group function
 */
function _dummyGroup() {
  return {
    release() {

    }
  }
}


/**
 * Common implementation of conditional logger creator
 */
export abstract class XwCommonConditionalLoggerCreator implements XwLoggerCreatable {
  /**
   * @inheritdoc
   */
  createLogger(this: XwCommonConditionalLoggerCreator, base?: XwLoggable): XwLoggable {
    const _base = base ?? xwConsoleLogger;

    return {
      log: this.isLog() ? _base.log : _dummyLog,
      info: this.isInfo() ? _base.info : _dummyLog,
      warn: this.isWarn() ? _base.warn : _dummyLog,
      error: this.isError() ? _base.error : _dummyLog,
      debug: this.isDebug() ? _base.debug : _dummyLog,
      group: this.isGroup() ? _base.group : _dummyGroup,
    };
  }


  /**
   * If console.log() should log
   * @returns
   */
  isLog(): boolean {
    return true;
  }


  /**
   * If console.info() should log
   * @returns
   */
  isInfo() : boolean {
    return true;
  }


  /**
   * If console.warn() should log
   * @returns
   */
  isWarn() : boolean {
    return true;
  }


  /**
   * If console.error() should log
   * @returns
   */
  isError() : boolean {
    return true;
  }


  /**
   * If console.debug() should log
   * @returns
   */
  isDebug() : boolean {
    return true;
  }


  /**
   * If console.group() should log
   * @returns
   */
  isGroup() : boolean {
    return true;
  }  
}