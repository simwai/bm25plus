/**
 * A simple, zero-dependency asynchronous lock for managing exclusive access.
 *
 * Useful for ensuring write operations are performed sequentially.
 */
export class AsyncLock {
  private promise: Promise<void> = Promise.resolve();

  /**
   * Acquires the lock. Resolves when the lock is available.
   *
   * @example
   * ```ts
   * const release = await lock.acquire();
   * try {
   *   // Exclusive access here
   * } finally {
   *   release();
   * }
   * ```
   */
  public async acquire(): Promise<() => void> {
    let release: (value: void | PromiseLike<void>) => void;
    const nextPromise = new Promise<void>((resolve) => {
      release = resolve;
    });

    const currentPromise = this.promise;
    this.promise = nextPromise;

    await currentPromise;
    // @ts-ignore
    return release;
  }
}
