Status: CONTRACT
Owns: the min generator — candidates, layout, invariants, params
Read with: [README.md](README.md)
Code: src/domain/generators/min.ts, src/domain/**tests**/generators.test.ts

# Min

## Config

```ts
interface MinConfig {
  type: 'min'
  max: number
  layout: VariationLayout
}
```

| Field    | Meaning                    | Default                     | Bounds |
| -------- | -------------------------- | --------------------------- | ------ |
| `max`    | highest minuend            | `10`                        | 1…1000 |
| `layout` | see [README.md](README.md) | `pb 5, res 4, lhs 4, rhs 0` | —      |

There is no lower bound knob: minuends always run 1…`max`.

## Candidate exercises

One group per minuend `m` in `1..max`. The group holds every `m - s` with the **subtrahend running
0…m-1**, so the subtrahend may be 0 and the remainder is never 0 and never negative. Group size = `m`.

## Layout

`variation`: blocks emitted `result…, rhs…, lhs…`, each of `perBlock` exercises.

## Invariants

- `result = lhs - rhs`.
- `result >= 1`, `rhs >= 0`, `lhs <= max`.
- Every planned block is filled completely; deterministic per seed; total ≤ `MAX_EXERCISES`.

## URL params

Shared `v`/`s`/`t` and the variation params `pb`/`res`/`lhs`/`rhs`: see [../url-state.md](../url-state.md).

| Param | Meaning         | Default |
| ----- | --------------- | ------- |
| `max` | highest minuend | `10`    |

## Edge cases

| Case               | Behaviour                              |
| ------------------ | -------------------------------------- |
| all block counts 0 | `NO_EXERCISES`                         |
| `max = 1`          | the single candidate `1 - 0`, repeated |
