import { XwResolvable } from '../interfaces/XwResolvable';


type ResolverFunction<T> = () => T;


export class XwResolveUsing<T> implements XwResolvable<T> {
  /**
   * Resolver function
   */
  private readonly _fn: ResolverFunction<T>;
  /**
   * Resolved instance
   */
  private _instance: T|undefined = undefined;


  /**
   * @constructor
   * @param fn Resolver function
   */
  constructor(fn: ResolverFunction<T>) {
    this._fn = fn;
  }


  /**
   * @inheritdoc
   */
  get r(): T {
    if (this._instance === undefined) {
      this._instance = this._fn();
    }
    return this._instance;
  }
};