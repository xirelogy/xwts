import { XwReleasable } from '../interfaces/XwReleasable';

/**
 * One time release implementation
 */
export class XwOneTimeRelease implements XwReleasable {
  /**
   * Action to be performed during release
   */
  private _releaseFn: () => void;
  /**
   * If already released
   */
  private _isReleased = false;


  /**
   * @constructor
   * @param releaseFn Action to be performed during release
   */
  constructor(releaseFn: () => void) {
    this._releaseFn = releaseFn;
  }


  /**
   * @inheritdoc
   */
  release(): void {
    if (this._isReleased) return;
    this._isReleased = true;
    this._releaseFn();
  }
}