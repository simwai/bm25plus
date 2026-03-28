[**bm25plus**](../README.md)

***

> **calculateBM25PlusScore**(`f`, `docLength`, `avgDocLength`, `docCount`, `termDocFreq`, `options`): `number`

Defined in: [utils/scorer.ts:16](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/utils/scorer.ts#L16)

Calculates the BM25+ score for a term within a document.

Formula: IDF * ((f * (k1 + 1)) / (f + k1 * norm) + delta)
where norm = (1 - b) + b * (docLength / avgDocLength)

## Parameters

### f

`number`

Frequency of the term in the document.

### docLength

`number`

Length of the document.

### avgDocLength

`number`

Average document length in the index.

### docCount

`number`

Total number of documents in the index.

### termDocFreq

`number`

Number of documents containing the term.

### options

`Required`\<[`BM25Options`](../interfaces/BM25Options.md)\>

BM25 configuration options.

## Returns

`number`
