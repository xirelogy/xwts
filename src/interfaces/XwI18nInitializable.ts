import { Stringable } from '../common';


/**
 * Representation of a localizable target
 */
export type XwLocalizableTarget = string|Stringable;


/**
 * Representation of a localizable tag function
 */
export type XwLocalizableFunction = (value: string) => XwLocalizableTarget;


/**
 * May initialize localizable tag for 18n
 */
export interface XwI18nInitializable {
  /**
   * May initialize a localizable tag function
   * @param className Associated class name
   * @returns The corresponding localizable tag function
   */
  init(className?: string): XwLocalizableFunction;
}