/**
 * May define translation for specific class
 */
export interface XwI18nDefinable {
  /**
   * Define translations
   * @param className Target class name
   * @param locale Target locale
   * @param translations All translations
   * @returns Current instance for command chaining
   */
  defines(className: string|null, locale: string, translations: Record<string, string>): XwI18nDefinable;


  /**
   * Define a translation
   * @param className Target class name
   * @param locale Target locale
   * @param source Source text
   * @param target Equivalent translation text (target text)
   * @returns Current instance for command chaining
   */
  define(className: string|null, locale: string, source: string, target: string): XwI18nDefinable;
}