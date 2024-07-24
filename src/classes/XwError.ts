import { Stringable } from '../common';
import { type XwErrorOptions } from '../interfaces/XwErrorOptions';
import LibString from '../libraries/LibString';


/**
 * Common error
 */
export class XwError extends Error {
  constructor(message?: string|Stringable, options?: XwErrorOptions) {
    super(message ? String(message) : undefined, options);
  }


  /**
   * Express anything like error string
   * @param v Target
   * @returns
   */
  static asString(v: any): string {
    if (v instanceof Error) return v.message;
    return LibString.getString(v);
  }


  /**
   * Express anything like an Error
   * @param v Target
   * @returns
   */
  static asError(v: any): Error {
    if (v instanceof Error) return v;
    return new Error(LibString.getString(v));
  }
}