[**bm25plus**](../README.md)

***

Defined in: [utils/lock.ts:6](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/utils/lock.ts#L6)

A simple, zero-dependency asynchronous lock for managing exclusive access.

Useful for ensuring write operations are performed sequentially.

## Constructors

### Constructor

> **new AsyncLock**(): `AsyncLock`

#### Returns

`AsyncLock`

## Methods

### acquire()

> **acquire**(): `Promise`\<() => `void`\>

Defined in: [utils/lock.ts:22](https://github.com/simwai/bm25plus/blob/3aff6be2a23dae656d3f69f583ec6ec4115ba430/src/utils/lock.ts#L22)

Acquires the lock. Resolves when the lock is available.

#### Returns

`Promise`\<() => `void`\>

#### Example

```ts
const release = await lock.acquire();
try {
  // Exclusive access here
} finally {
  release();
}
```
