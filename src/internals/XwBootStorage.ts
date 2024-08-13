import LibAsync from '../libraries/LibAsync';

import { _used } from '../sugar';
import { XwError } from '../classes/XwError';
import { xwI18nModuleInit } from '../features/XwI18n';
import { XwDuplicatedError } from '../classes/XwDuplicatedError';

import xw from '../Xw';


const _l = xwI18nModuleInit('XwBootStorage');


/**
 * Result collector
 */
interface BootProvided {
  /**
   * When the boot process completes (provided)
   */
  when: number;
  /**
   * Result as return from execution
   */
  result: any;
}


/**
 * A registered configuration (request) to the boot process
 */
export class XwBootConfig {
  /**
   * Initialization function
   */
  readonly fn: () => Promise<any>|any;
  /**
   * Items that will be provided after initialization
   */
  readonly provides: string;
  /**
   * Items that are dependent before initialization
   */
  readonly depends: string[];
  /**
   * If this configuration is currently running
   */
  private _isRunning = false;
  /**
   * If this configuration is completed
   */
  private _isCompleted = false;


  /**
   * @constructor
   * @param fn Initialization function
   * @param provides Items that will be provided after initialization
   * @param depends Items that are dependent before initialization
   */
  constructor(fn: () => Promise<any>|any, provides: string, depends: string[]) {
    this.fn = fn;
    this.provides = provides;
    this.depends = depends;
  }


  /**
   * If this item is runnable
   */
  get isRunnable(): boolean {
    if (this._isRunning) return false;
    if (this._isCompleted) return false;
    return true;
  }


  /**
   * Run the configuration
   */
  async run(): Promise<any> {
    if (!this.isRunnable) return;

    // Start running
    this._isRunning = true;

    // Capture and run
    try {
      return await xw.asAsyncFn(this.fn);
    } finally {
      this._isRunning = false;
      this._isCompleted = true;
    }
  }
}


/**
 * Internal storage for XwBoot
 */
export class XwBootStorage {
  /**
   * If current state is fresh (not yet run)
   */
  public isFresh: boolean = true;
  /**
   * If everything in the current run is successful
   */
  private _isAllSuccessful: boolean = false;
  /**
   * All provided items
   */
  private _provideds = new Map<string, BootProvided|Error|false>();
  /**
   * All boot configuration providers
   */
  private _providers = new Map<string, XwBootConfig>();


  /**
   * Register a configuration
   * @param config Configuration to be registered
   */
  register(config: XwBootConfig): void {
    const provides = config.provides;
    if (this._providers.has(provides)) throw new XwDuplicatedError(provides, _l('boot provider'));
    this._providers.set(provides, config);

    // Mark provided pending
    this._provideds.set(provides, false);
  }


  /**
   * Check if the given provider exist
   * @param provides Target to be checked for
   * @returns If exist
   */
  hasProvider(provides: string): boolean {
    return this._providers.has(provides);
  }


  /**
   * Check if all of the required dependencies are fulfilled
   * @param dependencies Required dependencies
   * @returns If fulfilled
   */
  isFulfilled(dependencies: string[]): boolean {
    for (const dependency of dependencies) {
      const stat = this._provideds.get(dependency) ?? false;
      if (stat === false) return false;
    }
    return true;
  }


  /**
   * Run the boot process
   */
  async run(): Promise<boolean> {
    this.isFresh = false;
    this._isAllSuccessful = true;

    while (true) {
      await this._loopProviders();
      if (this._isFullyProvided()) return this._isAllSuccessful;
      await LibAsync.sleep(10);
    }
  }


  /**
   * Read the result from the provided (fulfilled) dependency
   * @param provided
   * @returns
   */
  getResult(provided: string): any {
    const read = this._provideds.get(provided) ?? false;
    if (read === false) return undefined;
    if (read instanceof Error) throw read;
    return (read as BootProvided).result;
  }


  /**
   * If fully provided
   * @returns
   */
  private _isFullyProvided(): boolean {
    for (const provides of this._provideds.keys()) {
      if (this._provideds.get(provides) === false) return false;
    }
    return true;
  }


  /**
   * Loop through all providers and run those that can be initialize
   */
  private async _loopProviders(): Promise<void> {
    return new Promise((resolve) => {
      let totalStarted = 0;

      for (const provides of this._providers.keys()) {
        const config = this._providers.get(provides) as XwBootConfig;

        // Check state
        if (!config.isRunnable) continue;

        // Check dependencies
        if (!this.isFulfilled(config.depends)) continue;

        ++totalStarted;

        // Invoke
        xw.fork(async () => {
          try {
            const result = await config.run();
            this._provideds.set(config.provides, {
              when: Date.now(),
              result: result,
            });
          } catch (e) {
            this._isAllSuccessful = false;
            const _e = XwError.asError(e);
            xw.logger.warn(xw.format(_l('Failure while initializing \'{0}\': {1}'), config.provides, _e.message));
            this._provideds.set(config.provides, _e);
          } finally {
            resolve();
          }
        });
      }

      if (totalStarted <= 0) {
        resolve();
      }
    });
  }
}