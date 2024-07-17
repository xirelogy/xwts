import { XwLoggable } from '../interfaces/XwLoggable';
import { XwLoggerCreatable } from '../interfaces/XwLoggerCreatable';
import { _used } from '../sugar';


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
 * Logger creator that results in a dummy
 */
export class XwDummyLoggerCreator implements XwLoggerCreatable {
  /**
   * @constructor
   */
  constructor() {
  }


  /**
   * @inheritdoc
   */
  createLogger(base?: XwLoggable | undefined): XwLoggable {
    _used(base);
    return {
      log: _dummyLog,
      info: _dummyLog,
      warn: _dummyLog,
      error: _dummyLog,
      debug: _dummyLog,
      group: _dummyGroup,
    };
  }
}