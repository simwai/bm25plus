[**bm25plus**](../README.md)

***

Defined in: [worker/executor.ts:6](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/worker/executor.ts#L6)

Executes tasks on the main thread.

## Implements

- [`Executor`](../interfaces/Executor.md)

## Constructors

### Constructor

> **new MainThreadExecutor**(): `MainThreadExecutor`

#### Returns

`MainThreadExecutor`

## Methods

### execute()

> **execute**\<`T`, `R`\>(`task`, `payload`): `Promise`\<`R`\>

Defined in: [worker/executor.ts:13](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/worker/executor.ts#L13)

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

### registerHandler()

> **registerHandler**(`task`, `handler`): `void`

Defined in: [worker/executor.ts:9](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/worker/executor.ts#L9)

#### Parameters

##### task

`string`

##### handler

(`payload`) => `Promise`\<`any`\>

#### Returns

`void`
