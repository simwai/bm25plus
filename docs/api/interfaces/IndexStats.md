[**bm25plus**](../README.md)

***

Defined in: [types/index.ts:26](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/types/index.ts#L26)

Statistics required for BM25+ calculation.

## Properties

### avgDocLength

> **avgDocLength**: `number`

Defined in: [types/index.ts:30](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/types/index.ts#L30)

Average document length across the index.

***

### docCount

> **docCount**: `number`

Defined in: [types/index.ts:28](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/types/index.ts#L28)

Total number of documents in the index.

***

### termDocFreqs

> **termDocFreqs**: `Map`\<`string`, `number`\>

Defined in: [types/index.ts:32](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/types/index.ts#L32)

Map of term to the number of documents containing that term.
