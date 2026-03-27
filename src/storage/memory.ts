import type { DocumentStats, IndexStats, StorageProvider } from "../types/index.js";

/**
 * In-memory storage provider for fast, volatile indexing.
 */
export class MemoryProvider implements StorageProvider {
  private documents = new Map<string, DocumentStats>();
  private termDocFreqs = new Map<string, number>();
  private totalDocLength = 0;

  public async saveDocument(docId: string, stats: DocumentStats): Promise<void> {
    const existing = this.documents.get(docId);

    // If updating, subtract old stats
    if (existing) {
      this.totalDocLength -= existing.length;
      for (const term of existing.termFreqs.keys()) {
        const count = this.termDocFreqs.get(term) || 0;
        if (count > 0) {
          this.termDocFreqs.set(term, count - 1);
        }
      }
    }

    this.documents.set(docId, stats);
    this.totalDocLength += stats.length;

    for (const term of stats.termFreqs.keys()) {
      this.termDocFreqs.set(term, (this.termDocFreqs.get(term) || 0) + 1);
    }
  }

  public async getDocument(docId: string): Promise<DocumentStats | undefined> {
    return this.documents.get(docId);
  }

  public async getDocumentsContainingTerms(terms: string[]): Promise<Map<string, DocumentStats>> {
    const results = new Map<string, DocumentStats>();
    const searchTerms = new Set(terms);

    for (const [id, stats] of this.documents) {
      for (const term of stats.termFreqs.keys()) {
        if (searchTerms.has(term)) {
          results.set(id, stats);
          break;
        }
      }
    }
    return results;
  }

  public async getIndexStats(): Promise<IndexStats> {
    const docCount = this.documents.size;
    return {
      docCount,
      avgDocLength: docCount === 0 ? 0 : this.totalDocLength / docCount,
      termDocFreqs: new Map(this.termDocFreqs),
    };
  }

  public async clear(): Promise<void> {
    this.documents.clear();
    this.termDocFreqs.clear();
    this.totalDocLength = 0;
  }
}
