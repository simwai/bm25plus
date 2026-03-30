import { BM25Index } from '../index.js'
import type { BM25Options, Document } from '../types/index.js'

let index: BM25Index | null = null

function isInitPayload(payload: unknown): payload is BM25Options | undefined {
  return (
    payload === undefined ||
    (typeof payload === 'object' && payload !== null && !Array.isArray(payload))
  )
}

function isAddDocumentPayload(payload: unknown): payload is Document {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'id' in payload &&
    'fields' in payload &&
    typeof (payload as Document).id === 'string' &&
    typeof (payload as Document).fields === 'object'
  )
}

function isSearchPayload(payload: unknown): payload is { query: string; limit?: number } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'query' in payload &&
    typeof (payload as { query: string }).query === 'string'
  )
}

self.onmessage = async (event) => {
  const { id, task, payload } = event.data

  try {
    if (task === 'init') {
      if (isInitPayload(payload)) {
        index = new BM25Index(payload)
        self.postMessage({ id, result: 'initialized' })
      } else {
        throw new TypeError('Invalid payload for init task')
      }
      return
    }

    if (!index) {
      throw new Error('Index not initialized in worker')
    }

    let result: unknown
    switch (task) {
      case 'addDocument':
        if (isAddDocumentPayload(payload)) {
          await index.addDocument(payload)
          result = 'added'
        } else {
          throw new TypeError('Invalid payload for addDocument task')
        }
        break
      case 'search':
        if (isSearchPayload(payload)) {
          result = await index.search(payload.query, payload.limit)
        } else {
          throw new TypeError('Invalid payload for search task')
        }
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
