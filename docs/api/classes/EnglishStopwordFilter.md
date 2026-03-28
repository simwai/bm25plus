[**bm25plus**](../README.md)

***

Defined in: [utils/nlp.ts:20](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/utils/nlp.ts#L20)

Stopword filter using the 'stopword' package.
Defaults to English stopwords.

## Implements

- [`StopwordFilter`](../interfaces/StopwordFilter.md)

## Constructors

### Constructor

> **new EnglishStopwordFilter**(`customStopwords?`): `EnglishStopwordFilter`

Defined in: [utils/nlp.ts:23](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/utils/nlp.ts#L23)

#### Parameters

##### customStopwords?

`string`[]

#### Returns

`EnglishStopwordFilter`

## Methods

### filter()

> **filter**(`tokens`): `string`[]

Defined in: [utils/nlp.ts:27](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/utils/nlp.ts#L27)

#### Parameters

##### tokens

`string`[]

#### Returns

`string`[]

#### Implementation of

[`StopwordFilter`](../interfaces/StopwordFilter.md).[`filter`](../interfaces/StopwordFilter.md#filter)
