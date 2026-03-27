[**bm25plus**](../README.md)

***

Defined in: [types/index.ts:48](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/types/index.ts#L48)

Interface for storage providers.

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [types/index.ts:74](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/types/index.ts#L74)

Clears all data from storage.

#### Returns

`Promise`\<`void`\>

***

### getDocument()

> **getDocument**(`docId`): `Promise`\<[`DocumentStats`](DocumentStats.md) \| `undefined`\>

Defined in: [types/index.ts:59](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/types/index.ts#L59)

Retrieves statistics for a specific document.

#### Parameters

##### docId

`string`

#### Returns

`Promise`\<[`DocumentStats`](DocumentStats.md) \| `undefined`\>

***

### getDocumentsContainingTerms()

> **getDocumentsContainingTerms**(`terms`): `Promise`\<`Map`\<`string`, [`DocumentStats`](DocumentStats.md)\>\>

Defined in: [types/index.ts:64](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/types/index.ts#L64)

Retrieves all document IDs that contain any of the given terms.

#### Parameters

##### terms

`string`[]

#### Returns

`Promise`\<`Map`\<`string`, [`DocumentStats`](DocumentStats.md)\>\>

***

### getIndexStats()

> **getIndexStats**(): `Promise`\<[`IndexStats`](IndexStats.md)\>

Defined in: [types/index.ts:69](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/types/index.ts#L69)

Retrieves overall index statistics.

#### Returns

`Promise`\<[`IndexStats`](IndexStats.md)\>

***

### saveDocument()

> **saveDocument**(`docId`, `stats`): `Promise`\<`void`\>

Defined in: [types/index.ts:54](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/types/index.ts#L54)

Adds or updates a document in the storage.

#### Parameters

##### docId

`string`

Unique document ID.

##### stats

[`DocumentStats`](DocumentStats.md)

Document statistics.

#### Returns

`Promise`\<`void`\>
