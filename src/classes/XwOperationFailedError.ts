import { Stringable } from '../common';
import { type XwErrorOptions } from '../interfaces/XwErrorOptions';
import { XwError } from './XwError';
import { xwI18nModuleInit } from '../features/XwI18n';

import xw from '../Xw';


const _l = xwI18nModuleInit('XwOperationFailedError');


/**
 * Format the error message
 * @param type
 * @returns
 */
function _formatMessage(type?: string|Stringable): string {
  if (typeof type != 'undefined') {
    return xw.format(_l('{0} failed'), String(type));
  } else {
    return String(_l('Operation failed'));
  }
}


/**
 * Operation failed error
 */
export class XwOperationFailedError extends XwError {
  /**
   * @constructor
   * @param type Operation type
   * @param options
   */
  constructor(type?: string|Stringable, options?: XwErrorOptions) {
    const _message = _formatMessage(type);
    super(_message, options);
  }
}