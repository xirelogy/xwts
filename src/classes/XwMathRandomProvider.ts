import { XwCommonRandomProvider } from './XwCommonRandomProvider';

/**
 * Random provider from Math.random()
 */
export class XwMathRandomProvider extends XwCommonRandomProvider {
  /**
   * @inheritdoc
   */
  protected onNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}