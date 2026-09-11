Status: CONTRACT
Owns: the plus generator — candidates, the carry rule, layout, invariants, params
Read with: [README.md](README.md), [../decisions/0006-explicit-carry-predicate.md](../decisions/0006-explicit-carry-predicate.md)
Code: src/domain/generators/plus.ts, src/domain/generators/predicates.ts, src/domain/**tests**/generators.test.ts

# Plus

## Config

```ts
interface PlusConfig {
  type: 'plus'
  sumRange: { min: number; max: number }
  carry: 'any' | 'none'
  minOperand: number
  layout: VariationLayout
}
```

| Field        | Meaning                         | Default                     | Bounds |
| ------------ | ------------------------------- | --------------------------- | ------ |
| `sumRange`   | inclusive range of the sum      | `{0, 10}`                   | 0…1000 |
| `carry`      | allow tientaloverschrijding     | `any`                       | enum   |
| `minOperand` | lower bound on **both** addends | `0`                         | 0…1000 |
| `layout`     | see [README.md](README.md)      | `pb 5, res 4, lhs 4, rhs 0` | —      |

Three independent knobs: `sumRange` bounds the result, `carry` the units columns, `minOperand` each addend.

## Candidate exercises

One group per sum in `min..max`, holding every `lhs + rhs = sum` with
`minOperand <= lhs <= sum - minOperand` — so both addends are at or above `minOperand`.
With `carry: 'none'`, a candidate is kept only when `(lhs % 10) + (rhs % 10) <= 10`.

Filtering happens while the groups are built, never by post-filtering draws. Why: an empty group is
simply skipped, whereas a filtered source can run dry mid-sheet — so a no-carry sheet never does.

The predicate is what the label always claimed; the legacy site forced `lhs >= 10` instead, so
`3 + 12` never appeared. See [../decisions/0006-explicit-carry-predicate.md](../decisions/0006-explicit-carry-predicate.md).

## Layout

`variation`: blocks emitted `result…, rhs…, lhs…`, each of `perBlock` exercises.

## Invariants

- `lhs + rhs = result`; `min <= result <= max`; `lhs >= minOperand` and `rhs >= minOperand`.
- With `carry: 'none'`, `(lhs % 10) + (rhs % 10) <= 10` for every exercise, and with `minOperand: 0` sums with a small first addend (`lhs < 10`) do occur.
- Every planned block is filled completely; deterministic per seed; total ≤ `MAX_EXERCISES`.

## URL params

Shared `v`/`s`/`t` and the variation params `pb`/`res`/`lhs`/`rhs`: see [../url-state.md](../url-state.md).

| Param   | Meaning         | Default |
| ------- | --------------- | ------- |
| `min`   | lowest sum      | `0`     |
| `max`   | highest sum     | `10`    |
| `carry` | `any` \| `none` | `any`   |
| `mo`    | `minOperand`    | `0`     |

`min` is clamped to `max` on decode, so an inverted range never silently empties the sheet.

## Edge cases

| Case                                 | Behaviour                                                   |
| ------------------------------------ | ----------------------------------------------------------- |
| all block counts 0                   | `NO_EXERCISES`                                              |
| `minOperand > sum / 2` for every sum | every group empty; blocks render empty rather than throwing |
| `sumRange = {0, 0}`                  | the single candidate `0 + 0`, repeated                      |
