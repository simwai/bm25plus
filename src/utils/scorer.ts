import type { BM25Options } from '../types/index.js'

/**
 * Calculates the BM25+ score for a term within a document.
 *
 * Formula: IDF * ((f * (k1 + 1)) / (f + k1 * norm) + delta)
 * where norm = (1 - b) + b * (docLength / avgDocLength)
 *
 * @param f - Frequency of the term in the document.
 * @param docLength - Length of the document.
 * @param avgDocLength - Average document length in the index.
 * @param docCount - Total number of documents in the index.
 * @param termDocFreq - Number of documents containing the term.
 * @param options - BM25 configuration options.
 */
export function calculateBM25PlusScore(
  f: number,
  docLength: number,
  avgDocLength: number,
  docCount: number,
  termDocFreq: number,
  options: Required<BM25Options>,
): number {
  const { k1, b, delta } = options

  // Calculate IDF: log((N - n + 0.5) / (n + 0.5) + 1)
  // This version avoids negative values.
  const idf = Math.log((docCount - termDocFreq + 0.5) / (termDocFreq + 0.5) + 1)

  // Normalization factor
  const norm = 1 - b + b * (docLength / avgDocLength)

  // Term frequency component
  const tf = (f * (k1 + 1)) / (f + k1 * norm)

  return idf * (tf + delta)
}
