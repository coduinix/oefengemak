Status: CONTRACT
Owns: the delen generator — candidates, layout, invariants, params
Read with: [README.md](README.md)
Code: src/domain/generators/delen.ts, src/domain/**tests**/generators.test.ts

# Delen

## Config

```ts
interface DelenConfig {
  type: 'delen'
  divisors: readonly number[]
  layout: VariationLayout
}
```

| Field      | Meaning                    | Default                     | Bounds         |
| ---------- | -------------------------- | --------------------------- | -------------- |
| `divisors` | selected divisors          | 1…10                        | subset of 1…10 |
| `layout`   | see [README.md](README.md) | `pb 5, res 4, lhs 4, rhs 0` | —              |

The divisors are a config field even though the legacy site hardcoded 1…10; 1…10 is still the default.

## Candidate exercises

One group per selected divisor `d` (values ≤ 0 are dropped). Each group holds exactly 10 exercises:
the **quotient runs 1…10** and the dividend is `d × quotient`, so **only exact divisions are ever
generated** — there are no remainders and nothing is ever divided by zero.

## Layout

`variation`: blocks emitted `result…, rhs…, lhs…`, each of `perBlock` exercises.

## Invariants

- `rhs != 0` and `lhs % rhs === 0`.
- `1 <= result <= 10` and `result = lhs : rhs`.
- `rhs` is one of the selected `divisors`.
- Every planned block is filled completely; deterministic per seed; total ≤ `MAX_EXERCISES`.

## URL params

Shared `v`/`s`/`t` and the variation params `pb`/`res`/`lhs`/`rhs`: see [../url-state.md](../url-state.md).

| Param | Meaning                                                                    | Default |
| ----- | -------------------------------------------------------------------------- | ------- |
| `div` | divisor set, range-collapsed (`div=1-10`); values outside 1…10 are dropped | `1-10`  |

## Edge cases

| Case                 | Behaviour                                        |
| -------------------- | ------------------------------------------------ |
| no divisors selected | `EMPTY_SELECTION`; the section renders no blocks |
| all block counts 0   | `NO_EXERCISES`                                   |
| `divisors = [1]`     | 10 candidates `n : 1 = n`                        |
