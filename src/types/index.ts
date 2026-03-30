/**
 * Represents a document in the index.
 */
export interface Document {
  id: string
  fields: Record<string, string>
}

/**
 * Interface for tokenizing strings into terms.
 */
export interface Tokenizer {
  tokenize(text: string): string[]
}

/**
 * Interface for filtering terms (e.g., stopword removal).
 */
export interface StopwordFilter {
  filter(tokens: string[]): string[]
}

/**
 * Statistics required for BM25+ calculation.
 */
export interface IndexStats {
  docCount: number
  avgDocLength: number
  termDocFreqs: Map<string, number>
}

/**
 * Information about a specific document's length and term frequencies.
 */
export interface DocumentStats {
  length: number
  termFreqs: Map<string, number>
}

/**
 * Interface for storage providers.
 */
export interface StorageProvider {
  saveDocument(docId: string, stats: DocumentStats): Promise<void>
  getDocument(docId: string): Promise<DocumentStats | undefined>
  getDocumentsContainingTerms(terms: string[]): Promise<Map<string, DocumentStats>>
  getIndexStats(): Promise<IndexStats>
  clear(): Promise<void>
}

/**
 * Interface for execution models (Main thread, Web Worker, etc.).
 */
export interface Executor {
  execute<T, R>(task: string, payload: T): Promise<R>
}

/**
 * Configuration options for the BM25+ algorithm.
 */
export interface BM25Options {
  k1?: number
  b?: number
  delta?: number
}

/**
 * Full BM25 index config.
 */
export interface BM25Config {
  storage?: StorageProvider
  tokenizer?: Tokenizer
  stopwordFilter?: StopwordFilter
  options?: BM25Options
}
