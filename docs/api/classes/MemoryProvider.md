[**bm25plus**](../README.md)

***

Defined in: [storage/memory.ts:6](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/storage/memory.ts#L6)

In-memory storage provider for fast, volatile indexing.

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### Constructor

> **new MemoryProvider**(): `MemoryProvider`

#### Returns

`MemoryProvider`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [storage/memory.ts:61](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/storage/memory.ts#L61)

Clears all data from storage.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

***

### getDocument()

> **getDocument**(`docId`): `Promise`\<[`DocumentStats`](../interfaces/DocumentStats.md) \| `undefined`\>

Defined in: [storage/memory.ts:33](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/storage/memory.ts#L33)

Retrieves statistics for a specific document.

#### Parameters

##### docId

`string`

#### Returns

`Promise`\<[`DocumentStats`](../interfaces/DocumentStats.md) \| `undefined`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`getDocument`](../interfaces/StorageProvider.md#getdocument)

***

### getDocumentsContainingTerms()

> **getDocumentsContainingTerms**(`terms`): `Promise`\<`Map`\<`string`, [`DocumentStats`](../interfaces/DocumentStats.md)\>\>

Defined in: [storage/memory.ts:37](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/storage/memory.ts#L37)

Retrieves all document IDs that contain any of the given terms.

#### Parameters

##### terms

`string`[]

#### Returns

`Promise`\<`Map`\<`string`, [`DocumentStats`](../interfaces/DocumentStats.md)\>\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`getDocumentsContainingTerms`](../interfaces/StorageProvider.md#getdocumentscontainingterms)

***

### getIndexStats()

> **getIndexStats**(): `Promise`\<[`IndexStats`](../interfaces/IndexStats.md)\>

Defined in: [storage/memory.ts:52](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/storage/memory.ts#L52)

Retrieves overall index statistics.

#### Returns

`Promise`\<[`IndexStats`](../interfaces/IndexStats.md)\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`getIndexStats`](../interfaces/StorageProvider.md#getindexstats)

***

### saveDocument()

> **saveDocument**(`docId`, `stats`): `Promise`\<`void`\>

Defined in: [storage/memory.ts:11](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/storage/memory.ts#L11)

Adds or updates a document in the storage.

#### Parameters

##### docId

`string`

Unique document ID.

##### stats

[`DocumentStats`](../interfaces/DocumentStats.md)

Document statistics.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`saveDocument`](../interfaces/StorageProvider.md#savedocument)
