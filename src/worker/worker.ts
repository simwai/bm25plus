import { BM25Index } from '../index.js'
import type { BM25Config, BM25Options, Document } from '../types/index.js'

let index: BM25Index | null = null

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isBM25Options(value: unknown): value is BM25Options {
  if (!isPlainObject(value)) {
    return false
  }
  const { k1, b, delta } = value as BM25Options
  return (
    (k1 === undefined || typeof k1 === 'number') &&
    (b === undefined || typeof b === 'number') &&
    (delta === undefined || typeof delta === 'number')
  )
}

function isBM25Config(value: unknown): value is BM25Config {
  if (!isPlainObject(value)) {
    return false
  }
  if ('options' in value && !isBM25Options((value as BM25Config).options)) {
    return false
  }
  return true
}

function isInitPayload(payload: unknown): payload is BM25Options | BM25Config | undefined {
  return payload === undefined || isBM25Options(payload) || isBM25Config(payload)
}

function normalizeInitPayload(
  payload: BM25Options | BM25Config | undefined,
): BM25Config | undefined {
  if (payload === undefined) {
    return undefined
  }
  if (isBM25Config(payload)) {
    return payload
  }
  return { options: payload }
}

function isAddDocumentPayload(payload: unknown): payload is Document {
  return (
    isPlainObject(payload) &&
    'id' in payload &&
    'fields' in payload &&
    typeof (payload as unknown as Document).id === 'string' &&
    typeof (payload as unknown as Document).fields === 'object'
  )
}

function isSearchPayload(payload: unknown): payload is { query: string; limit?: number } {
  return (
    isPlainObject(payload) &&
    'query' in payload &&
    typeof (payload as { query: string }).query === 'string'
  )
}

self.onmessage = async (event) => {
  const { id, task, payload } = event.data

  try {
    if (task === 'init') {
      if (isInitPayload(payload)) {
        const config = normalizeInitPayload(payload)
        index = new BM25Index(config)
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
      case 'addDocument': {
        if (isAddDocumentPayload(payload)) {
          await index.addDocument(payload)
          result = 'added'
        } else {
          throw new TypeError('Invalid payload for addDocument task')
        }
        break
      }

      case 'search': {
        if (isSearchPayload(payload)) {
          result = await index.search(payload.query, payload.limit)
        } else {
          throw new TypeError('Invalid payload for search task')
        }
        break
      }

      case 'clear': {
        await index.clear()
        result = 'cleared'
        break
      }

      default: {
        throw new Error(`Unknown task: ${task}`)
      }
    }

    self.postMessage({ id, result })
  } catch (error) {
    self.postMessage({ id, error: (error as Error).message })
  }
}
