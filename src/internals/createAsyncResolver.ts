/**
 * Promise signature
 */
type ResolvedFunction<T> = (value: T) => void;

/**
 * Common signature
 */
type AsyncResolvableFunction<T> = () => Promise<T>;


/**
 * Create an asynchronous resolver function
 * @param fn
 */
export default function createAsyncResolver<T>(fn: AsyncResolvableFunction<T>): AsyncResolvableFunction<T> {
  /**
   * Temporary instance
   */
  let _instance: T|undefined = undefined;
  /**
   * Resolve list
   */
  let _resolvers = [] as ResolvedFunction<T>[];


  async function queueResolver(resolve: ResolvedFunction<T>) {
    if (_resolvers.length <= 0) {
      _resolvers.push(resolve);
      _instance = await fn();

      const popResolvers = [..._resolvers];
      _resolvers = [];

      for (const popResolver of popResolvers) {
        popResolver(_instance);
      }
    } else {
      _resolvers.push(resolve);
    }
  }


  return (): Promise<T> => {
    return new Promise((resolve) => {
      if (_instance !== undefined) {
        // Direct return
        resolve(_instance);
      } else {
        // Queue needed
        queueResolver(resolve);
      }
    });
  };
}