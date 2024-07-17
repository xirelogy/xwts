import {
  jsGlobalStoreAccess,
} from '../compat/JsGlobalStorage';

import { XwBootConfig, XwBootStorage } from '../internals/XwBootStorage';

import xw from '../Xw';


/**
 * Accept multiple items
 * @param spec Item specification
 * @returns 
 */
function _acceptItems(spec: string|string[]): string[]
{
  if (typeof spec === 'string') return [spec];
  return spec;
}


/**
 * Access to storage
 * @returns 
 */
function _getXwBootStorage(): XwBootStorage {
  return jsGlobalStoreAccess('XwBootStorage', () => new XwBootStorage());
}


/**
 * Boot support
 */
class XwBoot {
  /**
   * Define a bootable item, only when it is not yet defined
   * @param fn Initialization function
   * @param provides Items that will be provided after initialization
   * @param depends Items that are dependent before initialization
   */
  tryDefine(this: XwBoot, fn: () => Promise<any>|any, provides?: string, depends?: string|string[]): void {
    if (typeof provides != 'undefined') {
      if (_getXwBootStorage().hasProvider(provides)) return;
    }
    this.define(fn, provides, depends);
  }


  /**
   * Define a bootable item
   * @param fn Initialization function
   * @param provides Items that will be provided after initialization
   * @param depends Items that are dependent before initialization
   */  
  define(fn: () => Promise<any>|any, provides?: string, depends?: string|string[]): void {
    const _provides = provides ?? ('anonymous_' + xw.random.hexString(8));
    const _depends = _acceptItems(depends ?? []);

    // Create configuration and register
    const config = new XwBootConfig(fn, _provides, _depends);
    _getXwBootStorage().register(config);
  }


  /**
   * Run the boot up
   * @returns If all are well during boot up
   */
  async run(): Promise<boolean> {
    return await _getXwBootStorage().run();
  }


  /**
   * Read the result from the provided (fulfilled) dependency
   * @param provided 
   * @returns
   */
  getResult(provided: string): any {
    return _getXwBootStorage().getResult(provided);
  }


  /**
   * If current boot setup is fresh
   * @returns
   */
  get isFresh(): boolean {
    return _getXwBootStorage().isFresh;
  }
}

const xwBoot = new XwBoot();
export default xwBoot;