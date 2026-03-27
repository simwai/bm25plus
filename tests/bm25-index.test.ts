import { beforeEach, describe, expect, it } from "vitest";
import { BM25Index } from "../src/index.js";
import { MemoryProvider } from "../src/storage/memory.js";

describe("BM25Index", () => {
  let index: BM25Index;

  beforeEach(() => {
    index = new BM25Index({ storage: new MemoryProvider() });
  });

  it("should add documents and search correctly", async () => {
    await index.addDocument({ id: "1", fields: { content: "the quick brown fox" } });
    await index.addDocument({ id: "2", fields: { content: "jumps over the lazy dog" } });
    await index.addDocument({ id: "3", fields: { content: "the quick lazy fox" } });

    const results = await index.search("quick fox");
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe("1"); // 'quick fox' appears in 1 and 3. Wait, let's check scores.
    // 1: 'quick', 'brown', 'fox'
    // 3: 'quick', 'lazy', 'fox'
    // Both should have same score for 'quick fox'.
    expect(["1", "3"]).toContain(results[0].id);
    expect(["1", "3"]).toContain(results[1].id);
  });

  it("should rank more relevant documents higher", async () => {
    await index.addDocument({ id: "1", fields: { content: "the quick brown fox" } });
    await index.addDocument({ id: "2", fields: { content: "the quick quick brown fox" } });

    const results = await index.search("quick");
    expect(results[0].id).toBe("2");
  });

  it("should handle updates to documents", async () => {
    await index.addDocument({ id: "1", fields: { content: "apple pie" } });
    await index.search("apple"); // warmup

    await index.addDocument({ id: "1", fields: { content: "banana bread" } });

    const resultsApple = await index.search("apple");
    expect(resultsApple).toHaveLength(0);

    const resultsBanana = await index.search("banana");
    expect(resultsBanana[0].id).toBe("1");
  });

  it("should work with default settings (MemoryProvider)", async () => {
    const defaultIndex = new BM25Index();
    await defaultIndex.addDocument({ id: "1", fields: { text: "test" } });
    const results = await defaultIndex.search("test");
    expect(results[0].id).toBe("1");
  });

  it("should return empty results for unknown terms", async () => {
    await index.addDocument({ id: "1", fields: { text: "hello" } });
    const results = await index.search("world");
    expect(results).toHaveLength(0);
  });
});
