/**
 * Random provider
 */
export interface XwRandomProvidable {
  /**
   * Generate a random integer number within the given range
   * @param min Minimum
   * @param max Maximum
   * @returns The generated random number
   */
  number(min: number, max: number): number;
}
