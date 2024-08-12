import { Stringable } from './common';

import LibAsync from './libraries/LibAsync';
import LibTimeout from './libraries/LibTimeout';

import { type XwCoolOffHandleable } from './interfaces/XwCoolOffHandleable';
import { type XwLoggable } from './interfaces/XwLoggable';
import { type XwLoggerCreatable } from './interfaces/XwLoggerCreatable';
import { type XwRandomProvidable } from './interfaces/XwRandomProvidable';
import { type XwReleasable } from './interfaces/XwReleasable';
import { type XwStorageHandleable } from './interfaces/XwStorageHandleable';

import { XwError } from './classes/XwError';
import { XwOneTimeRelease } from './classes/XwOneTimeRelease';
import { XwGlobalCallback } from './classes/XwGlobalCallback';
import { XwMathRandomProvider } from './classes/XwMathRandomProvider';
import { XwOperationFailedError } from './classes/XwOperationFailedError';
import { XwRandom } from './classes/XwRandom';

import xwBoot from './features/XwBoot';
import xwDebugLog from './features/XwDebugLog';
import xwI18n, { xwI18nModuleInit } from './features/XwI18n';
import xwI18nSetup from './features/XwI18nSetup';
import xwConsoleLogger from './features/XwConsoleLogger';
import xwUrlBase64 from './features/XwUrlBase64';

import { jsGlobalStoreAccess } from './compat/JsGlobalStorage';
import { XwCustomStorage } from './internals/XwCustomStorage';


const _l = xwI18nModuleInit('Xw');


/**
 * Options for loadJavascript()
 */
interface LoadJavascriptOptions {
  /**
   * Timeout in milliseconds
   */
  timeoutMs?: number;
}


/**
 * Options for loadJsonp()
 */
interface LoadJsonpOptions {
  /**
   * The name of the callback argument
   */
  callbackArg?: string;
  /**
   * Timeout in milliseconds
   */
  timeoutMs?: number;
}


/**
 * File encoded in data-URL
 */
interface FileInDataUrl {
  /**
   * Original file name
   */
  name: string;
  /**
   * Original file type
   */
  type: string;
  /**
   * Original file size
   */
  size: number;
  /**
   * Payload data
   */
  data: string|ArrayBuffer|null;
}


/**
 * KeyframeAnimationOptions with extension
 */
interface XwKeyframeAnimationOptions extends KeyframeAnimationOptions {
  beforeAnimation?: () => void;
}


/**
 * Current random instance
 */
let _currentRandom: XwRandom|null = null;
/**
 * Current logger instance
 */
let _currentLogger: XwLoggable = xwConsoleLogger;


/**
 * Main interface
 */
class Xw {
  /**
   * Boot up support
   */
  readonly boot = xwBoot;
  /**
   * Debug log support
   */
  readonly debugLog = xwDebugLog;
  /**
   * Internationalization support
   */
  readonly i18n = xwI18n;
  /**
   * Internationalization setup
   */
  readonly i18nSetup = xwI18nSetup;
  /**
   * URL-safe base64 codec
   */
  readonly urlBase64 = xwUrlBase64;


  /**
   * Current logging handle
   */
  get logger(): XwLoggable {
    return _currentLogger;
  }


  /**
   * Set current logging handle from given creator
   */
  set loggerCreator(creator: XwLoggerCreatable) {
    _currentLogger = creator.createLogger();
  }


  /**
   * Random structure
   */
  get random(): XwRandom {
    if (_currentRandom === null) {
      _currentRandom = new XwRandom(new XwMathRandomProvider());
    }

    return _currentRandom;
  }


  /**
   * Random provider
   */
  set randomProvider(provider: XwRandomProvidable) {
    _currentRandom = new XwRandom(provider);
  }


  /**
   * Generate a time sensitive nonce
   * @returns Current timestamp
   */
  nonce(): number {
    return (new Date()).getTime();
  }


  /**
   * Flatten the target by removing all lazy evaluation (deep cloning)
   * @param v
   * @returns
   */
  flatten(v: any): any {
    return JSON.parse(JSON.stringify(v));
  }


  /**
   * Normalize a string
   * @param v
   * @returns
   */
  normalizeString(v: string|Stringable): string
  normalizeString(v: null): null
  normalizeString(v: string|Stringable|null): string|null
  normalizeString(v: string|Stringable|null): string|null {
    if (v === null) return null;
    return String(v);
  }


  /**
   * Escape according to HTML requirements
   * @param text
   * @returns
   */
  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }


  /**
   * Fork execution by deferring
   * @param fn What to execute
   * @returns Releaseable handle to cancel the execution
   */
  fork(fn: () => Promise<void>|void): XwReleasable {
    const handle = setTimeout(fn);
    return new XwOneTimeRelease(() => {
      clearTimeout(handle);
    });
  }


  /**
   * Host and run target function asynchronously
   * @param fn Target function
   * @returns Result after executing target function
   */
  async asAsyncFn<T>(fn: (() => Promise<T>)|(() => T)): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        const ret = fn();
        if (ret instanceof Promise) {
          ret.then(resolve).catch(reject);
        } else {
          resolve(ret);
        }
      } catch (e) {
        reject(e);
      }
    });
  }


  /**
   * Convert target into an asynchronous target (promise)
   * @param v Target
   * @returns
   */
  async asAsyncTarget<T>(v: Promise<T>|T): Promise<T> {
    if (v instanceof Promise) return v;
    return new Promise((resolve) => {
      resolve(v);
    });
  }


  /**
   * Sleep (defer execution) for given number of time
   * @param ms Duration in milliseconds
   */
  async sleep(ms: number): Promise<void> {
    return LibAsync.sleep(ms);
  }


  /**
   * Wait (with defer execution) until condition is met
   * @param condition Test condition function
   * @param ms Duration in milliseconds to wait in between check
   */
  async waitUntil(condition: () => boolean, ms?: number): Promise<void> {
    while (!condition()) {
      await LibAsync.sleep(ms ?? 100);
    }
  }


  /**
   * Load Javascript from given source
   * @param src URL to the Javascript
   * @param options
   */
  async loadJavascript(src: string, options?: LoadJavascriptOptions): Promise<void> {
    const optTimeoutMs = options?.timeoutMs ?? null;

    return new Promise((resolve, reject) => {
      // Handle timeout
      LibTimeout.rejectOnTimeout(reject, optTimeoutMs);

      // Create the script element
      const scriptElement = document.createElement('script');
      scriptElement.async = true;
      scriptElement.src = src;

      // Handle events from scrip element
      scriptElement.onload = () => {
        resolve();
      };
      scriptElement.onerror = (ev) => {
        reject(new XwOperationFailedError(_l('Loading Javascript'), {
          cause: { ev },
        }));
      };

      // Append into body
      document.body.appendChild(scriptElement);
    });
  }


  /**
   * Load JSON from given source using JSONP
   * @param src URL to the JSON
   * @param options
   * @returns The loaded result
   */
  async loadJsonp(this: Xw, src: string, options?: LoadJsonpOptions): Promise<any> {
    const optCallbackArg = options?.callbackArg ?? 'callback';
    const optTimeoutMs = options?.timeoutMs ?? null;

    return new Promise((resolve, reject) => {
      const callbackName = 'xwcb_' + this.random.lowerAlphanumString(8);
      const callback = new XwGlobalCallback(callbackName);

      // Declare the receiver
      callback.listen((data: any) => {
        callback.remove();
        resolve(data);
      });

      // Handle timeout
      LibTimeout.rejectOnTimeout(reject, optTimeoutMs, () => {
        setTimeout(() => {
          callback.remove();
        }, 1000);
      });

      // Process the source and prepare the final URL
      const parsedSrc = new URL(src, window.location.origin);
      if (parsedSrc.searchParams) {
        // Modern WebAPI's URL has searchParams
        parsedSrc.searchParams.append(optCallbackArg, callbackName);
      } else {
        // Outdated URL (IOS) has to use fallback method
        parsedSrc.search += (parsedSrc.search.length > 0) ? '&' : '?';
        parsedSrc.search += encodeURIComponent(optCallbackArg) + '=' + encodeURIComponent(callbackName);
      }

      // Create the script element
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.async = true;
      scriptElement.src = parsedSrc.href;

      // Handle errors in the script element
      scriptElement.onerror = (ev) => {
        callback.remove();
        reject(new XwOperationFailedError(_l('Loading JSONP'), {
          cause: { ev },
        }));
      };

      // Bind 'script' to 'head'
      document.getElementsByTagName('head')[0]?.appendChild(scriptElement);
    });
  }


  /**
   * Run animation on given element
   * @param element Element to be animated
   * @param propSpecs Pair of values for start and end keyframe
   * @param options Animation options
   * @returns
   */
  async animate(element: HTMLElement, propSpecs: Record<string, any[]>, options?: XwKeyframeAnimationOptions): Promise<void> {
    // Construct the keyframes
    const fromState: Record<string, any> = {};
    const toState: Record<string, any> = {};

    for (const prop in propSpecs) {
      const values = propSpecs[prop] as any[];
      fromState[prop] = values[0];
      toState[prop] = values[1];
    }

    const keyframes = [
      fromState,
      toState,
    ];

    // Host the animation
    return new Promise((resolve, reject) => {
      const anim = element.animate(keyframes, options);

      anim.oncancel = () => {
        reject(new Error(this.normalizeString(_l('Animation cancelled'))));
      };
      anim.onfinish = () => {
        // Finalize the styles
        for (const prop in toState) {
          (element.style as Record<string, any>)[prop] = toState[prop];
        }
        resolve();
      };

      // Pre-animation
      for (const prop in fromState) {
        (element.style as Record<string, any>)[prop] = fromState[prop];
      }

      // Do anything before animation
      if (typeof options?.beforeAnimation === 'function') {
        options!.beforeAnimation();
      }

      // Start playing
      anim.play();
    });
  }


  /**
   * Create a handle for timeout execution based on cool-off mechanism
   * @returns Corresponding handle
   */
  createCoolOff(): XwCoolOffHandleable {
    // Current handle
    let _timeoutHandle: NodeJS.Timeout|null = null;

    const _clearTimeoutHandle = () => {
      if (_timeoutHandle === null) return;
      clearTimeout(_timeoutHandle);
      _timeoutHandle = null;
    };

    // Execution trace
    let _isExecuting = false;

    // Return control interface
    return {
      /**
       * @inheritdoc
       */
      get isPending(): boolean {
        return _timeoutHandle !== null;
      },

      /**
       * @inheritdoc
       */
      get isExecuting(): boolean {
        return _isExecuting;
      },

      /**
       * @inheritdoc
       */
      delay(timeoutMs: number, fn: () => Promise<void>|void): void {
        _clearTimeoutHandle();
        _timeoutHandle = setTimeout(async () => {
          try {
            _isExecuting = true;
            await xw.asAsyncTarget(fn());
          } finally {
            _isExecuting = false;
            _timeoutHandle = null; // Clear handle after complete
          }
        }, timeoutMs);
      },

      /**
       * @inheritdoc
       */
      dismiss(): void {
        _clearTimeoutHandle();
      }
    };
  }


  /**
   * Format by replacing numeric placeholder with their corresponding argument
   * @param formatSpec Format specifier, where each placement is wrapped in curly brace
   * @param args
   * @returns Final string
   */
  format(formatSpec: string|Stringable, ...args: any): string {
    const _formatSpec = String(formatSpec);
    return _formatSpec.replace(/{(\d+)}/g, (match: string, num: any) => {
      const _num = parseInt(String(num));
      return args[_num] ?? match;
    });
  }


  /**
   * Convert target into string representation
   * @param target Target
   * @returns
   */
  stringOf(target?: any): string {
    if (typeof target === 'undefined') return '';
    if (target === null) return 'null';

    if (typeof target === 'string') return `'${target}'`;
    if (typeof target === 'number') return String(target);
    if (target === true) return String(_l('true'));
    if (target === false) return String(_l('false'));

    // May handle as 'Stringable'
    if (typeof target.toString === 'function') return target.toString();

    return JSON.stringify(xw.flatten(target));
  }


  /**
   * Read target file's data payload as Data URL
   * @param file Target file
   * @returns
   */
  async readFileAsDataUrl(file: File): Promise<FileInDataUrl> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          data: ev.target?.result ?? null,
        });
      };
      reader.onerror = (ev) => {
        reject(new XwError('Error while reading file as Data URL', {
          cause: {
            file: file,
            ev: ev,
          },
        }));
      };

      reader.readAsDataURL(file);
    });
  }


  /**
   * Get access to particular storage
   * @param key
   * @returns
   */
  createStorage<T>(key: string|Symbol): XwStorageHandleable<T> {
    const storage = jsGlobalStoreAccess('XwCustomStorage', () => new XwCustomStorage());
    return storage.access(key);
  }
}

const xw = new Xw();
export default xw;
