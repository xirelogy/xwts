/**
 * Syntax sugar to mark target variable as 'used'
 * @param v 
 */
export function _used(v: any): void {
  if (v) { }
}



/**
 * Syntax sugar to forcefully cast target as specific type
 * @param v 
 * @returns 
 */
export function _cast<T>(v: any): T {
  return v as T;
}