import { _used } from '../sugar';

import {
  jsGlobalStoreAccess,
} from '../compat/JsGlobalStorage';

import {
  XwI18nInitializable,
  XwLocalizableFunction,
} from '../interfaces/XwI18nInitializable';

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
 * Internationalization support
 */
class XwI18n implements XwI18nInitializable {
  /**
   * Current locale
   */
  get currentLocale(): string {
    return _getXwI18nStorage().currentLocale;
  }


  /**
   * Current locale
   */
  set currentLocale(locale: string) {
    const _locale = acceptLocale(locale);
    const _storage = _getXwI18nStorage();

    _storage.currentLocale = _locale;
    _storage.currentLocaleEvent.publish(_locale);
  }


  /**
   * Subscription to changes on current locale
   */
  get currentLocaleEvent() {
    return _getXwI18nStorage().currentLocaleEvent.expose();
  }


  /**
   * @inheritdoc
   */
  init(className?: string): XwLocalizableFunction {
    const finalClassKey = createFinalClassKey([ acceptClassName(className) ]);
    return _getXwI18nStorage().initTranslator(finalClassKey);
  }


  /**
   * Initialize with given module name
   * @param moduleName
   * @param furtherModuleNames Any further module names above current module name
   * @returns Initializer
   */
  initModule(moduleName: string, ...furtherModuleNames: string[]): XwI18nInitializable {
    return {
      /**
       * @inheritdoc
       */
      init: (className?: string) => {
        const finalClassKey = createFinalClassKey([
          acceptClassName(className),
          moduleName,
          ...furtherModuleNames,
        ]);
        return _getXwI18nStorage().initTranslator(finalClassKey);
      }
    }
  }
}

const xwI18n = new XwI18n();
export default xwI18n;


const xwModuleI18n = xwI18n.initModule('xwts');
const xwI18nModuleInit = xwModuleI18n.init;
export { xwI18nModuleInit };