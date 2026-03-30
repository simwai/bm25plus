import { Dexie, type EntityTable } from 'dexie'
import type { DocumentStats, IndexStats, StorageProvider } from '../types/index.js'

interface DocumentRow {
  id: string
  length: number
  termFreqs: [string, number][]
  terms: string[]
}

interface TotalDocLengthEntry {
  key: 'totalDocLength'
  value: number
}

interface TermDocFreqsEntry {
  key: 'termDocFreqs'
  value: Record<string, number>
}

type StatsEntry = TotalDocLengthEntry | TermDocFreqsEntry

type BM25Database = Dexie & {
  documents: EntityTable<DocumentRow, 'id'>
  stats: EntityTable<StatsEntry, 'key'>
}

function createDatabase(dbName: string): BM25Database {
  const db = new Dexie(dbName) as BM25Database

  db.version(1).stores({
    documents: 'id, *terms',
    stats: 'key',
  })

  return db
}

/**
 * IndexedDB storage provider using Dexie for persistence.
 */
export class IndexedDBProvider implements StorageProvider {
  private db: BM25Database

  constructor(dbName = 'bm25plus_db') {
    this.db = createDatabase(dbName)
  }

  public async saveDocument(docId: string, stats: DocumentStats): Promise<void> {
    await this.db.transaction('rw', this.db.documents, this.db.stats, async () => {
      const existing = await this.db.documents.get(docId)

      const totalDocLengthEntry = await this.db.stats.get('totalDocLength')
      let totalDocLength =
        totalDocLengthEntry?.key === 'totalDocLength' ? totalDocLengthEntry.value : 0

      const termDocFreqsEntry = await this.db.stats.get('termDocFreqs')
      const termDocFreqs = termDocFreqsEntry?.key === 'termDocFreqs' ? termDocFreqsEntry.value : {}

      // If updating, subtract old stats
      if (existing) {
        totalDocLength -= existing.length
        for (const [term] of existing.termFreqs) {
          const count = termDocFreqs[term] ?? 0
          if (count > 0) {
            termDocFreqs[term] = count - 1
          }
        }
      }

      const termFreqsArr = Array.from(stats.termFreqs.entries())
      const terms = Array.from(stats.termFreqs.keys())

      await this.db.documents.put({
        id: docId,
        length: stats.length,
        termFreqs: termFreqsArr,
        terms,
      })

      totalDocLength += stats.length
      for (const term of terms) {
        termDocFreqs[term] = (termDocFreqs[term] ?? 0) + 1
      }

      await this.db.stats.bulkPut([
        { key: 'totalDocLength', value: totalDocLength },
        { key: 'termDocFreqs', value: termDocFreqs },
      ])
    })
  }

  public async getDocument(docId: string): Promise<DocumentStats | undefined> {
    const doc = await this.db.documents.get(docId)
    if (!doc) {
      return undefined
    }
    return {
      length: doc.length,
      termFreqs: new Map(doc.termFreqs),
    }
  }

  public async getDocumentsContainingTerms(terms: string[]): Promise<Map<string, DocumentStats>> {
    const documents = await this.db.documents.where('terms').anyOf(terms).toArray()
    const results = new Map<string, DocumentStats>()
    for (const doc of documents) {
      results.set(doc.id, {
        length: doc.length,
        termFreqs: new Map(doc.termFreqs),
      })
    }
    return results
  }

  public async getIndexStats(): Promise<IndexStats> {
    const docCount = await this.db.documents.count()
    const totalDocLengthEntry = await this.db.stats.get('totalDocLength')
    const totalDocLength =
      totalDocLengthEntry?.key === 'totalDocLength' ? totalDocLengthEntry.value : 0

    const termDocFreqsEntry = await this.db.stats.get('termDocFreqs')
    const termDocFreqsObj = termDocFreqsEntry?.key === 'termDocFreqs' ? termDocFreqsEntry.value : {}

    return {
      docCount,
      avgDocLength: docCount === 0 ? 0 : totalDocLength / docCount,
      termDocFreqs: new Map(Object.entries(termDocFreqsObj)),
    }
  }

  public async clear(): Promise<void> {
    await this.db.documents.clear()
    await this.db.stats.clear()
  }
}
