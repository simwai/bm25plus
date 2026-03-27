import { describe, expect, it } from "vitest";
import { AsyncLock } from "../src/utils/lock.js";

describe("AsyncLock", () => {
  it("should allow sequential access", async () => {
    const lock = new AsyncLock();
    let counter = 0;

    const task = async () => {
      const release = await lock.acquire();
      try {
        const temp = counter;
        await new Promise((resolve) => setTimeout(resolve, 10));
        counter = temp + 1;
      } finally {
        release();
      }
    };

    await Promise.all([task(), task(), task()]);
    expect(counter).toBe(3);
  });
});
