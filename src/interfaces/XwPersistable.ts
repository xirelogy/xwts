/**
 * Support for key-value presistence
 */
export interface XwPersistable {
  /**
   * Load data
   * @param key Item key
   * @param altDefault Default value when item not found, null if not specified
   * @returns
   */
  load(key: string, altDefault?: any|null): any|null;


  /**
   * Save data
   * @param key Item key
   * @param value Value to be saved, or null to delete
   */
  save(key: string, value: any|null): void;


  /**
   * Delete data
   * @param key item key
   */
  delete(key: string): void;
}