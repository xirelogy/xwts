import { XwRandomProvidable } from '../interfaces/XwRandomProvidable';


/**
 * Common implementation of a random provider
 */
export abstract class XwCommonRandomProvider implements XwRandomProvidable {
  /**
   * @inheritdoc
   * @final
   */
  number(this: XwCommonRandomProvider, min: number, max: number): number {
    const _minInt = Math.floor(min);
    const _maxInt = Math.floor(max);

    if (_minInt == _maxInt) return _minInt;

    const [_min, _max] = _minInt < _maxInt ? [_minInt, _maxInt] : [_maxInt, _minInt];

    return this.onNumber(_min, _max);
  }


  /**
   * Generate a random integer number within the given range.
   * The provided min is guaranteed to be less than provided max.
   * @param min Minimum
   * @param max Maximum
   * @returns The generated random number
   */
  protected abstract onNumber(min: number, max: number): number;
}