import { type Stringable } from '../common';
import { default as xw } from '../Xw';
import { type XwErrorOptions } from '../interfaces/XwErrorOptions';
import { XwError } from './XwError';
import { xwI18nModuleInit } from '../features/XwI18n';


const _l = xwI18nModuleInit('XwDuplicatedError');


/**
 * Format message
 * @param target 
 * @param itemType 
 * @returns
 */
function formatMessage(target?: Stringable|string|number, itemType?: Stringable|string): Stringable|string {
  if (typeof target !== 'undefined') {
    if (typeof itemType !== 'undefined') {
      return xw.format(_l('Duplicate {1}: {0}'), xw.stringOf(target), itemType);
    } else {
      return xw.format(_l('Duplicate item: {0}'), xw.stringOf(target));
    }
  } else {
    return _l('Duplicate item');
  }
}


/**
 * Duplicate error
 */
export class XwDuplicatedError extends XwError {
  /**
   * @constructor
   * @param target 
   * @param itemType
   * @param options 
   */
  constructor(target?: Stringable|string|number, itemType?: Stringable|string, options?: XwErrorOptions) {
    const _message = xw.normalizeString(formatMessage(target, itemType));
    super(_message, options);
  }
}