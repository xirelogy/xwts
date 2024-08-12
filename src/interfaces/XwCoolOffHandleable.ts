/**
 * May handle timeout execution based on cool-off mechanism
 */
export interface XwCoolOffHandleable {
  /**
   * If there is pending execution
   */
  get isPending(): boolean;

  /**
   * If currently executing
   */
  get isExecuting(): boolean;

  /**
   * Initialize a delayed execution to be fired upon timeout
   * @param timeoutMs Cool off timeout (in milliseconds) before execution
   * @param fn Execution to be performed
   */
  delay(timeoutMs: number, fn: () => Promise<void>|void): void;

  /**
   * Cancel any pending execution, if any
   */
  dismiss(): void;
}