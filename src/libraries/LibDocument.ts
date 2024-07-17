export default class LibDocument {
  /**
   * Call target function when document is ready
   * @param fn Target function
   */
  static onReady(fn: () => void): void {
    if (document.readyState === 'complete') {
      // Document is already 'ready'
      fn();
    } else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'complete') return;
        fn();
      });
    }
  }
}