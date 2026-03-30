import Dexie from 'dexie'
import { IDBKeyRange, indexedDB } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { BM25Index } from '../src/index.js'
import { IndexedDBProvider } from '../src/storage/indexeddb.js'

// Configure Dexie to use fake-indexeddb
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange

describe('BM25Index (with IndexedDB)', () => {
  let index: BM25Index

  beforeEach(async () => {
    const storage = new IndexedDBProvider(`test_db_${Math.random()}`)
    await storage.clear()
    index = new BM25Index({ storage })
  })

  it('should add documents and search using IndexedDB', async () => {
    await index.addDocument({ id: '1', fields: { content: 'the quick brown fox' } })
    await index.addDocument({ id: '2', fields: { content: 'jumps over the lazy dog' } })

    const results = await index.search('quick fox')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')

    const results2 = await index.search('lazy dog')
    expect(results2).toHaveLength(1)
    expect(results2[0].id).toBe('2')
  })

  it('should rank correctly with IndexedDB', async () => {
    await index.addDocument({ id: '1', fields: { content: 'a apple' } })
    await index.addDocument({ id: '2', fields: { content: 'apple apple apple' } })

    const results = await index.search('apple')
    expect(results[0].id).toBe('2')
  })
})
