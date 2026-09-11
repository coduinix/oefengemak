Status: CONTRACT
Owns: the splitsen generator — candidates, layout, invariants, params
Read with: [README.md](README.md), [../ui-pages.md](../ui-pages.md)
Code: src/domain/generators/splitsen.ts, src/domain/**tests**/generators.test.ts

# Splitsen

Split a number into two parts. Rendered as a splits diagram, not an equation row — see [../ui-pages.md](../ui-pages.md) for the visual; do not infer markup from the `Exercise` shape.

## Config

```ts
interface SplitsenConfig {
  type: 'splitsen'
  numbers: readonly number[]
  count: number
  perBlock: number
}
```

| Field      | Meaning                      | Default | Bounds                               |
| ---------- | ---------------------------- | ------- | ------------------------------------ |
| `numbers`  | numbers to split             | 5…10    | subset of 1…20                       |
| `count`    | total exercises on the sheet | 20      | 0…`MAX_BLOCKS × MAX_PER_BLOCK` (800) |
| `perBlock` | exercises per block          | 5       | 1…20                                 |

## Candidate exercises

One group per selected number `total` (values ≤ 0 are dropped). The group holds every
`lhs + rhs = total` with **`lhs` running 0…total-1** — so the left part may be 0 and the right part,
which is what the pupil writes, never is. Group size = `total`.

## Layout

`flat`: `blocks = ceil(count / perBlock)` blocks of `perBlock` exercises, every block blanking `rhs`.

Note: `count` sets the exercise total only through that ceiling — the sheet actually holds
`blocks × perBlock` exercises, so a `count` that is not a multiple of `perBlock` rounds **up**.

## Invariants

- `result` is one of the selected `numbers`.
- `lhs + rhs = result`, `0 <= lhs < result`, so `rhs >= 1`.
- Every block blanks `rhs`.
- Every planned block is filled completely; generation is deterministic per seed.

## URL params

Shared `v`/`s`/`t`: see [../url-state.md](../url-state.md).

| Param   | Meaning                                                                 | Default |
| ------- | ----------------------------------------------------------------------- | ------- |
| `n`     | number set, range-collapsed (`n=5-10`); values outside 1…20 are dropped | `5-10`  |
| `count` | total exercises                                                         | `20`    |
| `pb`    | exercises per block                                                     | `5`     |

## Edge cases

| Case                                | Behaviour                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| no numbers selected                 | `EMPTY_SELECTION`; the section renders no blocks                               |
| `count = 0`                         | `NO_EXERCISES`                                                                 |
| `blocks × perBlock > MAX_EXERCISES` | `TOO_MANY_EXERCISES` — the cap applies to the rounded-up total, not to `count` |
| splitting 1                         | the single candidate `0 + 1`; repeats fill the block                           |
