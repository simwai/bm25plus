import Dexie from 'dexie'
import { IDBKeyRange, indexedDB } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { IndexedDBProvider } from '../src/storage/indexeddb.js'

// Configure Dexie to use fake-indexeddb
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange

describe('IndexedDBProvider', () => {
  let provider: IndexedDBProvider

  beforeEach(async () => {
    provider = new IndexedDBProvider(`test_db_${Math.random()}`)
    await provider.clear()
  })

  it('should save and retrieve document stats', async () => {
    const stats = {
      length: 10,
      termFreqs: new Map([
        ['hello', 1],
        ['world', 2],
      ]),
    }
    await provider.saveDocument('doc1', stats)
    const retrieved = await provider.getDocument('doc1')
    expect(retrieved).toEqual(stats)
  })

  it('should correctly update index statistics', async () => {
    await provider.saveDocument('doc1', {
      length: 5,
      termFreqs: new Map([
        ['a', 1],
        ['b', 1],
      ]),
    })
    await provider.saveDocument('doc2', {
      length: 15,
      termFreqs: new Map([
        ['a', 1],
        ['c', 1],
      ]),
    })

    const indexStats = await provider.getIndexStats()
    expect(indexStats.docCount).toBe(2)
    expect(indexStats.avgDocLength).toBe(10)
    expect(indexStats.termDocFreqs.get('a')).toBe(2)
    expect(indexStats.termDocFreqs.get('b')).toBe(1)
    expect(indexStats.termDocFreqs.get('c')).toBe(1)
  })
})
