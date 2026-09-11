Status: CONTRACT
Owns: the tafels generator — candidates, layout, invariants, params
Read with: [README.md](README.md)
Code: src/domain/generators/tafels.ts, src/domain/**tests**/generators.test.ts

# Tafels

## Config

```ts
interface TafelsConfig {
  type: 'tafels'
  tables: readonly number[]
  layout: VariationLayout
}
```

| Field    | Meaning                    | Default                     | Bounds         |
| -------- | -------------------------- | --------------------------- | -------------- |
| `tables` | selected tables            | 1…10                        | subset of 0…10 |
| `layout` | see [README.md](README.md) | `pb 5, res 4, lhs 4, rhs 0` | —              |

## Candidate exercises

One group per selected table. Each group holds exactly 10 exercises: the **multiplicand runs 1…10**
and is always the left operand, the table is always the right operand — `i × table = i·table` for
`i = 1..10`. Table 0 is selectable and yields ten all-zero results.

## Layout

`variation`: blocks emitted `result…, rhs…, lhs…`, each of `perBlock` exercises.

## Invariants

- `1 <= lhs <= 10`.
- `rhs` is one of the selected `tables`.
- `result = lhs × rhs`.
- Every planned block is filled completely; deterministic per seed; total ≤ `MAX_EXERCISES`.

## URL params

Shared `v`/`s`/`t` and the variation params `pb`/`res`/`lhs`/`rhs`: see [../url-state.md](../url-state.md).

| Param | Meaning                                                                  | Default |
| ----- | ------------------------------------------------------------------------ | ------- |
| `tab` | table set, range-collapsed (`tab=1-10`); values outside 0…10 are dropped | `1-10`  |

## Edge cases

| Case               | Behaviour                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| no tables selected | `EMPTY_SELECTION`; the section renders no blocks                                                         |
| `tables = [0]`     | valid — 10 candidates, all with result 0; the `lhs`-blank block then asks for a value that is not unique |
| all block counts 0 | `NO_EXERCISES`                                                                                           |
