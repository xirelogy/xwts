type ListeningFn = (...args: any[]) => void;


/**
 * Install a global callback
 * @param name
 * @param fn
 */
export function jsInstallGlobalCallback(name: string, fn: ListeningFn): void;


/**
 * Uninstall a global callback
 * @param name
 */
export function jsUninstallGlobalCallback(name: string): void;
