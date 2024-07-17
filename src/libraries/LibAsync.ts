export default class LibAsync {
  /**
   * Sleep (defer execution) for given number of time
   * @param ms Duration in milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }


  /**
   * Wait asynchronously until the given condition fulfilled
   * @param checkFn Check function for condition
   * @param sleepMs Sleep duration (in milliseconds) in between check, default is 10ms
   */
  static async waitUntil(checkFn: () => boolean, sleepMs?: number): Promise<void> {
    const _sleepMs = sleepMs ?? 10;
    while (true) {
      if (checkFn()) return;
      await this.sleep(_sleepMs);
    }
  }
}