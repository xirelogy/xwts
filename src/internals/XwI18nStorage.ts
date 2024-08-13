import { XwEventBroker } from '../classes/XwEventBroker';
import {
  XwLocalizableFunction,
} from '../interfaces/XwI18nInitializable';


/**
 * The default classname, when not specified
 */
const DEFAULT_CLASSNAME = '.';


/**
 * Accept and normalize locale
 * @param locale
 * @returns
 */
export function acceptLocale(locale: string): string {
  return locale.trim().toLowerCase().replace('_', '-');
}


/**
 * Normalize and accept class name
 * @param className
 * @returns
 */
export function acceptClassName(className: string|null|undefined): string {
  return className ?? DEFAULT_CLASSNAME;
}


/**
 * Create a final class name from list of names
 * @param names
 * @returns
 */
export function createFinalClassKey(names: string[]): string {
  let ret = '';
  for (const name of names) {
    ret = '::[' + name + ']' + ret;
  }

  return ret.substring(2);
}


export class XwI18nStorage {
  /**
   * The current locale
   */
  currentLocale: string;
  /**
   * Event broker for changes to current locale
   */
  currentLocaleEvent = new XwEventBroker<string>();
  /**
   * All class translations (Key order: classKey, locale, keyword)
   */
  classTranslations = new Map<string, Map<string, Map<string, string>>>();
  /**
   * Status of initialization request
   */
  classInitializations = new Map<string, boolean>();


  /**
   * @constructor
   * @param currentLocale The specific current locale to be used
   */
  constructor(currentLocale?: string) {
    this.currentLocale = currentLocale ?? 'en-us';
  }


  /**
   * Define translations
   * @param key Container key name
   * @param locale Target locale
   * @param translations Translation values
   */
  defineTranslates(key: string, locale: string, translations: Record<string, string>): void {
    const classTranslation = this.classTranslations.get(key) ?? new Map<string, Map<string, string>>();
    const localeTranslation = classTranslation.get(locale) ?? new Map<string, string>();

    for (const source in translations) {
      if (source === '') continue;
      localeTranslation.set(source, translations[source] as string);
    }

    classTranslation.set(locale, localeTranslation);
    this.classTranslations.set(key, classTranslation);

    this.classInitializations.set(key, true);
  }


  /**
   * Define translation
   * @param key Container key name
   * @param locale Target locale
   * @param source Source value
   * @param target Target value
   */
  defineTranslate(key: string, locale: string, source: string, target: string): void {
    const classTranslation = this.classTranslations.get(key) ?? new Map<string, Map<string, string>>();
    const localeTranslation = classTranslation.get(locale) ?? new Map<string, string>();

    if (source === '') return;
    localeTranslation.set(source, target);

    classTranslation.set(locale, localeTranslation);
    this.classTranslations.set(key, classTranslation);

    this.classInitializations.set(key, true);
  }


  initTranslator(classKey: string): XwLocalizableFunction {
    // Mark as 'require initialization' if not yet initialized
    if (!this.classInitializations.has(classKey)) {
      this.classInitializations.set(classKey, false);
    }

    // Capture 'this'
    const _this = this;

    return (value: string) => {
      // Some extra safety
      if (typeof value === 'undefined') return '';
      const text = '' + value;

      // Wrap as a Stringable (delay evaluation)
      return {
        toString: () => {
          const classTranslation = _this.classTranslations.get(classKey) ?? null;
          if (classTranslation === null) return text;

          const localeTranslation = classTranslation.get(_this.currentLocale) ?? null;
          if (localeTranslation === null) return text;

          return localeTranslation.get(text) ?? text;
        }
      };
    };
  }
}
