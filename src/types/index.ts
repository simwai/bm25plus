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
  /** Total number of documents in the index. */
  docCount: number
  /** Average document length across the index. */
  avgDocLength: number
  /** Map of term to the number of documents containing that term. */
  termDocFreqs: Map<string, number>
}

/**
 * Information about a specific document's length and term frequencies.
 */
export interface DocumentStats {
  /** Number of terms in the document. */
  length: number
  /** Map of term to its frequency in the document. */
  termFreqs: Map<string, number>
}

/**
 * Interface for storage providers.
 */
export interface StorageProvider {
  /**
   * Adds or updates a document in the storage.
   * @param docId - Unique document ID.
   * @param stats - Document statistics.
   */
  saveDocument(docId: string, stats: DocumentStats): Promise<void>

  /**
   * Retrieves statistics for a specific document.
   */
  getDocument(docId: string): Promise<DocumentStats | undefined>

  /**
   * Retrieves all document IDs that contain any of the given terms.
   */
  getDocumentsContainingTerms(terms: string[]): Promise<Map<string, DocumentStats>>

  /**
   * Retrieves overall index statistics.
   */
  getIndexStats(): Promise<IndexStats>

  /**
   * Clears all data from storage.
   */
  clear(): Promise<void>
}

/**
 * Interface for execution models (Main thread, Web Worker, etc.).
 */
export interface Executor {
  /**
   * Executes a task.
   */
  execute<T, R>(task: string, payload: T): Promise<R>
}

/**
 * Configuration options for the BM25+ algorithm.
 */
export interface BM25Options {
  /** k1 parameter (controls term frequency saturation). Default: 1.5. */
  k1?: number
  /** b parameter (controls document length normalization). Default: 0.75. */
  b?: number
  /** delta parameter (BM25+ improvement). Default: 0.5. */
  delta?: number
}
