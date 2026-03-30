import { describe, expect, it } from 'vitest'
import { MainThreadExecutor } from '../src/worker/executor.js'

describe('MainThreadExecutor', () => {
  it('should register and execute handlers', async () => {
    const executor = new MainThreadExecutor()
    executor.registerHandler(
      'add',
      async (payload: { a: number; b: number }) => payload.a + payload.b,
    )

    const result = await executor.execute('add', { a: 1, b: 2 })
    expect(result).toBe(3)
  })

  it('should throw error if handler not found', async () => {
    const executor = new MainThreadExecutor()
    await expect(executor.execute('missing', {})).rejects.toThrow(
      'No handler registered for task: missing',
    )
  })
})
