export * from './storage/sqlite.js'
export * from './storage/indexeddb.js'
export * from './storage/memory.js'
export * from './types/index.js'
export * from './utils/lock.js'
export * from './utils/nlp.js'
export * from './utils/scorer.js'
export * from './worker/executor.js'

import { MemoryProvider } from './storage/memory.js'
import type {
  BM25Options,
  Document,
  DocumentStats,
  StopwordFilter,
  StorageProvider,
  Tokenizer,
} from './types/index.js'
import { AsyncLock } from './utils/lock.js'
import { DefaultTokenizer, EnglishStopwordFilter } from './utils/nlp.js'
import { calculateBM25PlusScore } from './utils/scorer.js'

export interface BM25Config {
  storage?: StorageProvider
  tokenizer?: Tokenizer
  stopwordFilter?: StopwordFilter
  options?: BM25Options
}

/**
 * Main entry point for the BM25+ search index.
 */
export class BM25Index {
  private storage: StorageProvider
  private tokenizer: Tokenizer
  private stopwordFilter: StopwordFilter
  private lock = new AsyncLock()
  private options: Required<BM25Options>

  constructor(config: BM25Config = {}) {
    this.storage = config.storage || new MemoryProvider()
    this.tokenizer = config.tokenizer || new DefaultTokenizer()
    this.stopwordFilter = config.stopwordFilter || new EnglishStopwordFilter()
    this.options = {
      k1: config.options?.k1 ?? 1.5,
      b: config.options?.b ?? 0.75,
      delta: config.options?.delta ?? 0.5,
    }
  }

  public async addDocument(doc: Document): Promise<void> {
    const release = await this.lock.acquire()
    try {
      const allText = Object.values(doc.fields).join(' ')
      const tokens = this.tokenizer.tokenize(allText)
      const filteredTokens = this.stopwordFilter.filter(tokens)

      const termFreqs = new Map<string, number>()
      for (const token of filteredTokens) {
        termFreqs.set(token, (termFreqs.get(token) || 0) + 1)
      }

      const stats: DocumentStats = {
        length: filteredTokens.length,
        termFreqs,
      }

      await this.storage.saveDocument(doc.id, stats)
    } finally {
      release()
    }
  }

  public async search(query: string, limit = 10): Promise<{ id: string; score: number }[]> {
    const tokens = this.tokenizer.tokenize(query)
    const filteredQueryTokens = this.stopwordFilter.filter(tokens)

    if (filteredQueryTokens.length === 0) {
      return []
    }

    const indexStats = await this.storage.getIndexStats()
    if (indexStats.docCount === 0) {
      return []
    }

    const candidateDocs = await this.storage.getDocumentsContainingTerms(filteredQueryTokens)
    if (candidateDocs.size === 0) {
      return []
    }

    const results: { id: string; score: number }[] = []

    for (const [docId, docStats] of candidateDocs) {
      let totalScore = 0
      for (const term of filteredQueryTokens) {
        const f = docStats.termFreqs.get(term) || 0
        if (f > 0) {
          const termDocFreq = indexStats.termDocFreqs.get(term) || 0
          totalScore += calculateBM25PlusScore(
            f,
            docStats.length,
            indexStats.avgDocLength,
            indexStats.docCount,
            termDocFreq,
            this.options,
          )
        }
      }
      results.push({ id: docId, score: totalScore })
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  public async clear(): Promise<void> {
    const release = await this.lock.acquire()
    try {
      await this.storage.clear()
    } finally {
      release()
    }
  }
}
