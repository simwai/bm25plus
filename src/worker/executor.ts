/** biome-ignore-all lint/suspicious/noExplicitAny: any is easier right now */
import type { Executor } from '../types/index.js'

/**
 * Executes tasks on the main thread.
 */
export class MainThreadExecutor implements Executor {
  private handlers = new Map<string, (payload: any) => Promise<any>>()

  public registerHandler(task: string, handler: (payload: any) => Promise<any>) {
    this.handlers.set(task, handler)
  }

  public async execute<T, R>(task: string, payload: T): Promise<R> {
    const handler = this.handlers.get(task)
    if (!handler) {
      throw new Error(`No handler registered for task: ${task}`)
    }
    return handler(payload)
  }
}

/**
 * Executes tasks using a Web Worker.
 */
export class WorkerExecutor implements Executor {
  private worker: Worker
  private pendingTasks = new Map<
    string,
    { resolve: (val: any) => void; reject: (err: any) => void }
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
      this.pendingTasks.set(id, { resolve, reject })
      this.worker.postMessage({ id, task, payload })
    })
  }

  public terminate() {
    this.worker.terminate()
  }
}
