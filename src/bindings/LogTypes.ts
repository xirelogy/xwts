import { XwReleasable } from '../interfaces/XwReleasable';


/**
 * Generic definition of log function
 */
export type LogFunction = (...args: any) => void;
/**
 * Generic definition of group function
 * @param label Group label
 */
export type GroupFunction = (label?: string) => XwReleasable;