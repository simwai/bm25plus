# Getting Started

Welcome to `bm25plus`, a search library designed with humans in mind. We want to make it as easy as possible to add high-quality search to your modern applications.

## Installation

```bash
pnpm add bm25plus
```

## Basic Usage

The simplest way to use `bm25plus` is with the default `MemoryProvider`:

```typescript
import { BM25Index } from 'bm25plus';

const index = new BM25Index();

await index.addDocument({
  id: '1',
  fields: {
    title: 'The Future of Search',
    content: 'BM25+ is a modern ranking algorithm for information retrieval.'
  }
});

const results = await index.search('ranking algorithm');
console.log(results); // [{ id: '1', score: 2.14... }]
```

## Persistence with IndexedDB

If you need your index to persist across page reloads, use the `IndexedDBProvider`:

```typescript
import { BM25Index, IndexedDBProvider } from 'bm25plus';

const storage = new IndexedDBProvider('my_search_index');
const index = new BM25Index({ storage });

// Documents are now saved to IndexedDB!
```

## Web Worker Support

For larger indices, we recommend running the search logic in a Web Worker to keep the UI responsive.

```typescript
import { WorkerExecutor } from 'bm25plus';

const executor = new WorkerExecutor('/worker.js');

// Initialize the worker index
await executor.execute('init', {});

// Add documents from the main thread
await executor.execute('addDocument', { id: '1', fields: { ... } });

// Search from the main thread
const results = await executor.execute('search', { query: 'ranking' });
```

---

*Inspired by the clean, functional vibes of Anthony Fu and the enthusiastic clarity of Benjamin Goertzel.*
