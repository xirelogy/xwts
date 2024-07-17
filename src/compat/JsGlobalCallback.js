/**
 * Install a global callback
 * @param {string} name 
 * @param {function(...*):void} fn 
 */
export function jsInstallGlobalCallback(name, fn) {
  window[name] = fn;
}


/**
 * Uninstall a global callback
 * @param {string} name 
 */
export function jsUninstallGlobalCallback(name) {
  delete window[name];
}