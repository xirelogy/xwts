import { XwI18nDefinable } from './XwI18nDefinable';


/**
 * May define module translation for specific class
 */
export interface XwI18nModuleDefinable {
  /**
   * Create definition to define module's translations
   * @param moduleNames Stack of module names
   * @returns
   */
  define(...moduleNames: string[]): XwI18nDefinable;
}