[**bm25plus**](../README.md)

***

Defined in: [index.ts:28](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/index.ts#L28)

Main entry point for the BM25+ search index.

This class orchestrates the indexing and searching process,
delegating storage and NLP tasks to the provided strategies.

## Constructors

### Constructor

> **new BM25Index**(`config?`): `BM25Index`

Defined in: [index.ts:35](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/index.ts#L35)

#### Parameters

##### config?

###### options?

[`BM25Options`](../interfaces/BM25Options.md)

###### stopwordFilter?

[`StopwordFilter`](../interfaces/StopwordFilter.md)

###### storage?

[`StorageProvider`](../interfaces/StorageProvider.md)

###### tokenizer?

[`Tokenizer`](../interfaces/Tokenizer.md)

#### Returns

`BM25Index`

## Methods

### addDocument()

> **addDocument**(`doc`): `Promise`\<`void`\>

Defined in: [index.ts:64](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/index.ts#L64)

Adds a document to the index.

#### Parameters

##### doc

[`Document`](../interfaces/Document.md)

#### Returns

`Promise`\<`void`\>

#### Remarks

This operation is thread-safe. If the document ID exists, it will be updated.

#### Example

```ts
await index.addDocument({ id: '1', fields: { title: 'Hello World' } });
```

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [index.ts:133](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/index.ts#L133)

Clears all documents from the index.

#### Returns

`Promise`\<`void`\>

***

### search()

> **search**(`query`, `limit?`): `Promise`\<`object`[]\>

Defined in: [index.ts:94](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/index.ts#L94)

Searches the index for the given query.

#### Parameters

##### query

`string`

The search query string.

##### limit?

`number` = `10`

Maximum number of results to return.

#### Returns

`Promise`\<`object`[]\>

Array of document IDs and their scores, sorted by score descending.
