import { eng, removeStopwords } from 'stopword'
import type { StopwordFilter, Tokenizer } from '../types/index.js'

/**
 * Default tokenizer that splits text into alphanumeric tokens and converts to lowercase.
 */
export class DefaultTokenizer implements Tokenizer {
  public tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 0)
  }
}

/**
 * Stopword filter using the 'stopword' package.
 * Defaults to English stopwords.
 */
export class EnglishStopwordFilter implements StopwordFilter {
  private stopwords: string[]

  constructor(customStopwords?: string[]) {
    this.stopwords = customStopwords || eng
  }

  public filter(tokens: string[]): string[] {
    return removeStopwords(tokens, this.stopwords)
  }
}
