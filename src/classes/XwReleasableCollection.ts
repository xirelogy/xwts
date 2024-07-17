import { XwReleasable } from '../interfaces/XwReleasable';

/**
 * Collection of multiple releasable items to be released together
 */
export class XwReleasableCollection implements XwReleasable {
  /**
   * All items
   */
  private _items: XwReleasable[] = [];


  /**
   * @constructor
   * @param items Items to be placed in collection
   */
  constructor(items?: XwReleasable[]) {
    for (const item of (items ?? [])) {
      this._items.push(item);
    }
  }


  /**
   * Push an item to be included into the collection
   * @param item
   */
  push(item: XwReleasable) {
    this._items.push(item);
  }


  /**
   * Push an item to be included into the collection (safe version)
   * @param item
   */
  safePush(item: XwReleasable|null|undefined) {
    if (typeof item === 'undefined' || item === null) return;
    this._items.push(item);
  }


  /**
   * @inheritdoc
   */
  release(): void {
    // Items made local
    const items = this._items;
    this._items = [];

    // Release the items
    for (const item of items) {
      item.release();
    }
  }
}