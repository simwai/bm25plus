import Database from 'better-sqlite3'
import type { DocumentStats, IndexStats, StorageProvider } from '../types/index.js'

/**
 * SQLite storage provider using better-sqlite3.
 * Adheres to the StorageProvider interface for search persistence.
 */
export class SQLiteProvider implements StorageProvider {
  private db: Database.Database

  constructor(dbPath = ':memory:') {
    this.db = new Database(dbPath)
    this.init()
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        length INTEGER,
        termFreqs TEXT
      );
      CREATE TABLE IF NOT EXISTS document_terms (
        doc_id TEXT,
        term TEXT,
        FOREIGN KEY(doc_id) REFERENCES documents(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_document_terms_term ON document_terms(term);
      CREATE TABLE IF NOT EXISTS stats (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `)
  }

  public async saveDocument(docId: string, stats: DocumentStats): Promise<void> {
    const termFreqsJson = JSON.stringify(Array.from(stats.termFreqs.entries()))

    const transaction = this.db.transaction(() => {
      // Handle stats update logic (subtract old if exists)
      const existing = this.db.prepare('SELECT length, termFreqs FROM documents WHERE id = ?').get(docId) as { length: number, termFreqs: string } | undefined

      let totalDocLength = 0
      let termDocFreqs: Record<string, number> = {}

      const statsRow = this.db.prepare('SELECT value FROM stats WHERE key = ?').get('global') as { value: string } | undefined
      if (statsRow) {
        const parsed = JSON.parse(statsRow.value)
        totalDocLength = parsed.totalDocLength || 0
        termDocFreqs = parsed.termDocFreqs || {}
      }

      if (existing) {
        totalDocLength -= existing.length
        const existingFreqs = new Map<string, number>(JSON.parse(existing.termFreqs))
        for (const term of existingFreqs.keys()) {
          if (termDocFreqs[term] > 0) {
            termDocFreqs[term]--
          }
        }
        this.db.prepare('DELETE FROM document_terms WHERE doc_id = ?').run(docId)
      }

      this.db.prepare('INSERT OR REPLACE INTO documents (id, length, termFreqs) VALUES (?, ?, ?)').run(docId, stats.length, termFreqsJson)

      const insertTerm = this.db.prepare('INSERT INTO document_terms (doc_id, term) VALUES (?, ?)')
      for (const term of stats.termFreqs.keys()) {
        insertTerm.run(docId, term)
        termDocFreqs[term] = (termDocFreqs[term] || 0) + 1
      }

      totalDocLength += stats.length
      this.db.prepare('INSERT OR REPLACE INTO stats (key, value) VALUES (?, ?)').run('global', JSON.stringify({ totalDocLength, termDocFreqs }))
    })

    transaction()
  }

  public async getDocument(docId: string): Promise<DocumentStats | undefined> {
    const row = this.db.prepare('SELECT length, termFreqs FROM documents WHERE id = ?').get(docId) as { length: number, termFreqs: string } | undefined
    if (!row) return undefined

    return {
      length: row.length,
      termFreqs: new Map(JSON.parse(row.termFreqs))
    }
  }

  public async getDocumentsContainingTerms(terms: string[]): Promise<Map<string, DocumentStats>> {
    if (terms.length === 0) return new Map()

    const placeholders = terms.map(() => '?').join(',')
    const rows = this.db.prepare(`
      SELECT DISTINCT d.id, d.length, d.termFreqs
      FROM documents d
      JOIN document_terms dt ON d.id = dt.doc_id
      WHERE dt.term IN (${placeholders})
    `).all(...terms) as { id: string, length: number, termFreqs: string }[]

    const results = new Map<string, DocumentStats>()
    for (const row of rows) {
      results.set(row.id, {
        length: row.length,
        termFreqs: new Map(JSON.parse(row.termFreqs))
      })
    }
    return results
  }

  public async getIndexStats(): Promise<IndexStats> {
    const docCountRow = this.db.prepare('SELECT COUNT(*) as count FROM documents').get() as { count: number }
    const docCount = docCountRow.count

    const statsRow = this.db.prepare('SELECT value FROM stats WHERE key = ?').get('global') as { value: string } | undefined

    let totalDocLength = 0
    let termDocFreqs = new Map<string, number>()

    if (statsRow) {
      const parsed = JSON.parse(statsRow.value)
      totalDocLength = parsed.totalDocLength || 0
      termDocFreqs = new Map(Object.entries(parsed.termDocFreqs || {})) as Map<string, number>
    }

    return {
      docCount,
      avgDocLength: docCount === 0 ? 0 : totalDocLength / docCount,
      termDocFreqs
    }
  }

  public async clear(): Promise<void> {
    this.db.transaction(() => {
      this.db.prepare('DELETE FROM documents').run()
      this.db.prepare('DELETE FROM document_terms').run()
      this.db.prepare('DELETE FROM stats').run()
    })()
  }

  public close() {
    this.db.close()
  }
}
