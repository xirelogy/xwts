import { type XwErrorOptions } from '../interfaces/XwErrorOptions';
import { XwError } from './XwError';
import { xwI18nModuleInit } from '../features/XwI18n';


const _l = xwI18nModuleInit('XwTimeoutError');


/**
 * Timeout error
 */
export class XwTimeoutError extends XwError {
  /**
   * @constructor
   * @param message 
   * @param options 
   */
  constructor(message?: string, options?: XwErrorOptions) {
    const _message = message ?? String(_l('Timeout'));
    super(_message, options);
  }
}