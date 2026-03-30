import type { Executor } from '../types/index.js'

/**
 * Executes tasks on the main thread.
 */
export class MainThreadExecutor implements Executor {
  private handlers = new Map<string, (payload: unknown) => Promise<unknown>>()

  public registerHandler<T, R>(task: string, handler: (payload: T) => Promise<R>) {
    this.handlers.set(task, handler as (payload: unknown) => Promise<unknown>)
  }

  public async execute<T, R>(task: string, payload: T): Promise<R> {
    const handler = this.handlers.get(task)
    if (!handler) {
      throw new Error(`No handler registered for task: ${task}`)
    }
    return (await handler(payload)) as R
  }
}

/**
 * Executes tasks using a Web Worker.
 */
export class WorkerExecutor implements Executor {
  private worker: Worker
  private pendingTasks = new Map<
    string,
    { resolve: (val: unknown) => void; reject: (err: Error) => void }
  >()
  private nextId = 0

  constructor(workerScriptUrl: string) {
    this.worker = new Worker(workerScriptUrl, { type: 'module' })
    this.worker.onmessage = (event) => {
      const { id, result, error } = event.data
      const task = this.pendingTasks.get(id)
      if (task) {
        if (error) {
          task.reject(new Error(error))
        } else {
          task.resolve(result)
        }
        this.pendingTasks.delete(id)
      }
    }
  }

  public async execute<T, R>(task: string, payload: T): Promise<R> {
    const id = (this.nextId++).toString()
    return new Promise((resolve, reject) => {
      this.pendingTasks.set(id, {
        resolve: (val) => {
          resolve(val as R)
        },
        reject,
      })
      this.worker.postMessage({ id, task, payload })
    })
  }

  public terminate() {
    this.worker.terminate()
  }
}
