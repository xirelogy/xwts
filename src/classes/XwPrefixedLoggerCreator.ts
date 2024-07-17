import xwConsoleLogger from '../features/XwConsoleLogger';
import { XwLoggable } from '../interfaces/XwLoggable';
import { XwLoggerCreatable } from '../interfaces/XwLoggerCreatable';


/**
 * Logger creator with a prefix
 */
export class XwPrefixedLoggerCreator implements XwLoggerCreatable {
  /**
   * Source text
   */
  private _source: string;


  /**
   * @constructor
   * @param source Source text
   */
  constructor(source: string) {
    this._source = source;
  }


  /**
   * @inheritdoc
   */
  createLogger(base?: XwLoggable | undefined): XwLoggable {
    const _base = base ?? xwConsoleLogger;
    const _sourceTag = `[${this._source}]`;

    return {
      log: _base.log.bind(_base, _sourceTag),
      info: _base.info.bind(_base, _sourceTag),
      warn: _base.warn.bind(_base, _sourceTag),
      error: _base.error.bind(_base, _sourceTag),
      debug: _base.debug.bind(_base, _sourceTag),
      group: (label?: string) => {
        const _outLabel = typeof label != 'undefined' ? `${_sourceTag} ${label}` : _sourceTag;
        return _base.group(_outLabel);
      },
    };
  }
}