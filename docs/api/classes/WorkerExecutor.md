[**bm25plus**](../README.md)

***

Defined in: [worker/executor.ts:25](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/worker/executor.ts#L25)

Executes tasks using a Web Worker.

## Implements

- [`Executor`](../interfaces/Executor.md)

## Constructors

### Constructor

> **new WorkerExecutor**(`workerScriptUrl`): `WorkerExecutor`

Defined in: [worker/executor.ts:33](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/worker/executor.ts#L33)

#### Parameters

##### workerScriptUrl

`string`

#### Returns

`WorkerExecutor`

## Methods

### execute()

> **execute**\<`T`, `R`\>(`task`, `payload`): `Promise`\<`R`\>

Defined in: [worker/executor.ts:49](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/worker/executor.ts#L49)

Executes a task.

#### Type Parameters

##### T

`T`

##### R

`R`

#### Parameters

##### task

`string`

##### payload

`T`

#### Returns

`Promise`\<`R`\>

#### Implementation of

[`Executor`](../interfaces/Executor.md).[`execute`](../interfaces/Executor.md#execute)

***

### terminate()

> **terminate**(): `void`

Defined in: [worker/executor.ts:57](https://github.com/simwai/bm25plus/blob/f31dd3b649087c2d0891ca541792c06efa6459e8/src/worker/executor.ts#L57)

#### Returns

`void`
