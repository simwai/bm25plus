import { BM25Index } from '../index.js'

let index: BM25Index | null = null

self.onmessage = async (event) => {
  const { id, task, payload } = event.data

  try {
    if (task === 'init') {
      index = new BM25Index(payload)
      self.postMessage({ id, result: 'initialized' })
      return
    }

    if (!index) {
      throw new Error('Index not initialized in worker')
    }

    let result: any
    switch (task) {
      case 'addDocument':
        await index.addDocument(payload)
        result = 'added'
        break
      case 'search':
        result = await index.search(payload.query, payload.limit)
        break
      case 'clear':
        await index.clear()
        result = 'cleared'
        break
      default:
        throw new Error(`Unknown task: ${task}`)
    }

    self.postMessage({ id, result })
  } catch (error) {
    self.postMessage({ id, error: (error as Error).message })
  }
}
