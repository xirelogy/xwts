import { _used } from '../sugar';
import { XwI18nDefinable } from '../interfaces/XwI18nDefinable';
import { XwI18nModuleDefinable } from '../interfaces/XwI18nModuleDefinable';

import {
  jsGlobalStoreAccess,
} from '../compat/JsGlobalStorage';

import {
  acceptLocale,
  acceptClassName,
  createFinalClassKey,
  XwI18nStorage,
} from '../internals/XwI18nStorage';


/**
 * Access to storage
 * @returns 
 */
function _getXwI18nStorage(): XwI18nStorage {
  return jsGlobalStoreAccess('XwI18nStorage', () => new XwI18nStorage());
}


/**
 * Compile string
 * @param v Target string
 * @returns Compiled and escaped string
 */
function _compileString(v: string|null): string {
  if (v === null) return 'null';
  return '\'' + v.replace('\'', '\\\'') + '\'';
}



class XwI18nSetup implements XwI18nModuleDefinable {
  /**
   * @inheritdoc
   */
  define(...moduleNames: string[]): XwI18nDefinable {
    return {
      /**
       * @inheritdoc
       */
      defines(className: string|null, locale: string, translations: Record<string, string>): XwI18nDefinable {
        const finalClassKey = createFinalClassKey([
          acceptClassName(className),
          ...moduleNames,
        ]);

        _getXwI18nStorage().defineTranslates(finalClassKey, acceptLocale(locale), translations);
        return this;
      },


      /**
       * @inheritdoc
       */
      define(className: string|null, locale: string, source: string, target: string): XwI18nDefinable {
        const finalClassKey = createFinalClassKey([
          acceptClassName(className),
          ...moduleNames,
        ]);

        _getXwI18nStorage().defineTranslate(finalClassKey, acceptLocale(locale), source, target);
        return this;
      },
    };
  }


  /**
   * Compile JSON 
   * @param className
   * @param locale 
   * @param content 
   * @returns Specific code that when execute, register translation to the setup function
   */
  compileJson(className: string|null, locale: string, content: string): string {

    const translation = JSON.parse(content);

    let ret = '';
    ret += '(def) => {';
    ret += 'def.defines(' + _compileString(className) + ',' + _compileString(locale) + ',' + JSON.stringify(translation) + ')';
    ret += '};';

    return ret;
  }
}


const xwI18nSetup = new XwI18nSetup();
export default xwI18nSetup;