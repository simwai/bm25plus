import { Dexie } from 'dexie'
import { IDBKeyRange, indexedDB } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { BM25Index } from '../src/index.js'
import { IndexedDBProvider } from '../src/storage/indexeddb.js'

// Configure Dexie to use fake-indexeddb
const dexieAny = Dexie as any
dexieAny.dependencies.indexedDB = indexedDB
dexieAny.dependencies.IDBKeyRange = IDBKeyRange

describe('BM25Index with IndexedDBProvider', () => {
  let index: BM25Index

  beforeEach(async () => {
    const storage = new IndexedDBProvider(`test_db_${Math.random()}`)
    await storage.clear()
    index = new BM25Index({ storage })
  })

  it('should add documents and search correctly', async () => {
    await index.addDocument({ id: '1', fields: { content: 'the quick brown fox' } })
    await index.addDocument({ id: '2', fields: { content: 'jumps over the lazy dog' } })

    const results = await index.search('quick fox')
    expect(results).toHaveLength(1)
    expect(results[0]!.id).toBe('1')

    const results2 = await index.search('lazy dog')
    expect(results2).toHaveLength(1)
    expect(results2[0]!.id).toBe('2')
  })

  it('should return empty results for unknown terms', async () => {
    await index.addDocument({ id: '1', fields: { text: 'hello' } })
    const results = await index.search('world')
    expect(results).toHaveLength(0)
  })
})
