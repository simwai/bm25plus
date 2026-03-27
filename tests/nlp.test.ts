import { describe, expect, it } from "vitest";
import { DefaultTokenizer, EnglishStopwordFilter } from "../src/utils/nlp.js";

describe("NLP Utilities", () => {
  describe("DefaultTokenizer", () => {
    const tokenizer = new DefaultTokenizer();

    it("should tokenize text correctly", () => {
      const tokens = tokenizer.tokenize("Hello, world! This is a test.");
      expect(tokens).toEqual(["hello", "world", "this", "is", "a", "test"]);
    });

    it("should handle numbers", () => {
      const tokens = tokenizer.tokenize("BM25+ algorithm 2023");
      expect(tokens).toEqual(["bm25", "algorithm", "2023"]);
    });
  });

  describe("EnglishStopwordFilter", () => {
    const filter = new EnglishStopwordFilter();

    it("should remove common English stopwords", () => {
      const tokens = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
      const filtered = filter.filter(tokens);
      expect(filtered).not.toContain("the");
      expect(filtered).toContain("quick");
    });
  });
});
