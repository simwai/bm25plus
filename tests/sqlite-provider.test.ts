import { beforeEach, describe, expect, it, afterAll } from 'vitest'
import { SQLiteProvider } from '../src/storage/sqlite.js'

describe('SQLiteProvider', () => {
  let provider: SQLiteProvider

  beforeEach(() => {
    provider = new SQLiteProvider(':memory:')
  })

  afterAll(() => {
    provider.close()
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

  it('should handle document updates', async () => {
    await provider.saveDocument('doc1', {
      length: 5,
      termFreqs: new Map([['a', 1]]),
    })
    await provider.saveDocument('doc1', {
      length: 10,
      termFreqs: new Map([['b', 1]]),
    })

    const indexStats = await provider.getIndexStats()
    expect(indexStats.docCount).toBe(1)
    expect(indexStats.avgDocLength).toBe(10)
    expect(indexStats.termDocFreqs.get('a') || 0).toBe(0)
    expect(indexStats.termDocFreqs.get('b')).toBe(1)
  })

  it('should find documents containing specific terms', async () => {
    await provider.saveDocument('doc1', {
      length: 5,
      termFreqs: new Map([['apple', 1]]),
    })
    await provider.saveDocument('doc2', {
      length: 5,
      termFreqs: new Map([['banana', 1]]),
    })
    await provider.saveDocument('doc3', {
      length: 5,
      termFreqs: new Map([['apple', 1], ['banana', 1]]),
    })

    const results = await provider.getDocumentsContainingTerms(['apple'])
    expect(results.size).toBe(2)
    expect(results.has('doc1')).toBe(true)
    expect(results.has('doc3')).toBe(true)

    const both = await provider.getDocumentsContainingTerms(['apple', 'banana'])
    expect(both.size).toBe(3)
  })
})
