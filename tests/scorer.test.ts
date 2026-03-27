import { describe, expect, it } from "vitest";
import { calculateBM25PlusScore } from "../src/utils/scorer.js";

describe("BM25+ Scorer", () => {
  const options = { k1: 1.5, b: 0.75, delta: 0.5 };

  it("should calculate a positive score for a term present in the document", () => {
    const score = calculateBM25PlusScore(2, 10, 8, 100, 5, options);
    expect(score).toBeGreaterThan(0);
  });

  it("should increase score with higher frequency", () => {
    const score1 = calculateBM25PlusScore(1, 10, 10, 100, 5, options);
    const score2 = calculateBM25PlusScore(2, 10, 10, 100, 5, options);
    expect(score2).toBeGreaterThan(score1);
  });

  it("should penalize longer documents if frequency is constant", () => {
    const scoreShort = calculateBM25PlusScore(1, 5, 10, 100, 5, options);
    const scoreLong = calculateBM25PlusScore(1, 15, 10, 100, 5, options);
    expect(scoreShort).toBeGreaterThan(scoreLong);
  });

  it("should produce higher scores than standard BM25 (delta = 0)", () => {
    const bm25Plus = calculateBM25PlusScore(2, 10, 10, 100, 5, options);
    const bm25 = calculateBM25PlusScore(2, 10, 10, 100, 5, { ...options, delta: 0 });
    expect(bm25Plus).toBeGreaterThan(bm25);
  });
});
