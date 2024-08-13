import {
  jsInstallGlobalCallback,
  jsUninstallGlobalCallback,
} from '../compat/JsGlobalCallback';


/**
 * Support for global callback (for usage like JSONP)
 */
export class XwGlobalCallback {
  /**
   * The callback name
   */
  private _name: string;
  /**
   * If currently listening
   */
  private _isListening: boolean;


  /**
   * @constructor
   * @param name The callback name
   */
  constructor(name: string) {
    this._name = name;
    this._isListening = false;
  }


  /**
   * Listen to callback using given handler function
   * @param fn The handler function when callback is invoked
   * @returns If successfully listen
   */
  listen(fn: (...args: any[]) => void): boolean {
    if (this._isListening) return false;

    jsInstallGlobalCallback(this._name, fn);
    this._isListening = true;

    return true;
  }


  /**
   * Remove the callback (if listening)
   * @returns If successfully removed
   */
  remove(): boolean {
    if (!this._isListening) return false;

    jsUninstallGlobalCallback(this._name);
    this._isListening = false;

    return true;
  }
}
