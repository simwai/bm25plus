[**bm25plus**](../README.md)

***

Defined in: [storage/indexeddb.ts:53](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/storage/indexeddb.ts#L53)

IndexedDB storage provider using Dexie for persistence.

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### Constructor

> **new IndexedDBProvider**(`dbName?`): `IndexedDBProvider`

Defined in: [storage/indexeddb.ts:56](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/storage/indexeddb.ts#L56)

#### Parameters

##### dbName?

`string` = `"bm25plus_db"`

#### Returns

`IndexedDBProvider`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [storage/indexeddb.ts:133](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/storage/indexeddb.ts#L133)

Clears all data from storage.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

***

### getDocument()

> **getDocument**(`docId`): `Promise`\<[`DocumentStats`](../interfaces/DocumentStats.md) \| `undefined`\>

Defined in: [storage/indexeddb.ts:99](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/storage/indexeddb.ts#L99)

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

Defined in: [storage/indexeddb.ts:108](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/storage/indexeddb.ts#L108)

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

Defined in: [storage/indexeddb.ts:121](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/storage/indexeddb.ts#L121)

Retrieves overall index statistics.

#### Returns

`Promise`\<[`IndexStats`](../interfaces/IndexStats.md)\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`getIndexStats`](../interfaces/StorageProvider.md#getindexstats)

***

### saveDocument()

> **saveDocument**(`docId`, `stats`): `Promise`\<`void`\>

Defined in: [storage/indexeddb.ts:60](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/storage/indexeddb.ts#L60)

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
