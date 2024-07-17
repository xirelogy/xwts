import { XwLoggable } from '../interfaces/XwLoggable';
import * as LogTypes from '../bindings/LogTypes';


/**
 * Logger interface
 */
class XwConsoleLogger implements XwLoggable {
  /**
   * @inheritdoc
   */
  log: LogTypes.LogFunction = console.log.bind(console);
  /**
   * @inheritdoc
   */
  info: LogTypes.LogFunction = console.info.bind(console);
  /**
   * @inheritdoc
   */
  warn: LogTypes.LogFunction = console.warn.bind(console);
  /**
   * @inheritdoc
   */
  error: LogTypes.LogFunction = console.error.bind(console);
  /**
   * @inheritdoc
   */
  debug: LogTypes.LogFunction = console.debug.bind(console);
  /**
   * @inheritdoc
   */
  group: LogTypes.GroupFunction = (label?: string) => {
    console.group(label);
    return {
      /**
       * @inheritdoc
       */
      release() {
        console.groupEnd();
      }
    };
  };
}


const xwConsoleLogger = new XwConsoleLogger();
export default xwConsoleLogger;