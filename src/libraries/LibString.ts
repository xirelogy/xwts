export default class LibString {
  /**
   * Convert to string (may apply conversion rules)
   * @param v
   */
  static getString(v: any): string {
    if (typeof v === 'string') return v;
    return String(v);
  }
}