import { type XwErrorOptions } from '../interfaces/XwErrorOptions';
import { XwError } from './XwError';
import { xwI18nModuleInit } from '../features/XwI18n';


const _l = xwI18nModuleInit('XwNotImplementedError');


/**
 * Not implemented error
 */
export class XwNotImplementedError extends XwError {
  /**
   * @constructor
   * @param message 
   * @param options 
   */
  constructor(message?: string, options?: XwErrorOptions) {
    const _message = message ?? String(_l('Not implemented'));
    super(_message, options);
  }
}