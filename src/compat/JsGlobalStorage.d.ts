/**
 * Access to item stored in global storage
 * @param namespace Storage namespace
 * @param prototypeFn Prototype function to create new item if not yet exist
 * @returns The corresponding stored item
 */
export function jsGlobalStoreAccess<T extends object>(namespace: string, prototypeFn: () => T): T;
