/**
 * Check function
 */
export type XwDebugLogCheckFunction = (source: string) => boolean;


export class XwDebugLogStorage {
  /**
   * Checker function
   */
  private _checker: XwDebugLogCheckFunction = () => false;


  /**
   * If logging shall be enabled for given debugger source
   * @param source 
   * @returns
   */
  public isLog(source: string): boolean {
    return this._checker(source);
  }


  /**
   * Define the checker function
   * @param checker 
   */
  public defineCheck(checker: XwDebugLogCheckFunction): void {
    this._checker = checker;
  }
}