Status: CONTRACT
Owns: the shared option vocabulary of the six exercise types, and the index of their docs
Read with: [../domain.md](../domain.md)
Code: src/domain/generators/**, src/domain/config/**, src/domain/**tests**/generators.test.ts

# Exercise types

| Type     | Route              | Layout      | Blanked slots     | Doc                        |
| -------- | ------------------ | ----------- | ----------------- | -------------------------- |
| splitsen | `/sommen/splitsen` | `flat`      | `rhs` (always)    | [splitsen.md](splitsen.md) |
| plus     | `/sommen/plus`     | `variation` | result, rhs, lhs  | [plus.md](plus.md)         |
| min      | `/sommen/min`      | `variation` | result, rhs, lhs  | [min.md](min.md)           |
| tafels   | `/sommen/tafels`   | `variation` | result, rhs, lhs  | [tafels.md](tafels.md)     |
| delen    | `/sommen/delen`    | `variation` | result, rhs, lhs  | [delen.md](delen.md)       |
| breuken  | `/sommen/breuken`  | `grouped`   | `result` (always) | [breuken.md](breuken.md)   |

The legacy `js/*.js` generators — in git history before the rewrite commit — are the behavioural reference, not a port. See [../decisions/0002-rewrite-not-port-generators.md](../decisions/0002-rewrite-not-port-generators.md).

## VariationLayout

Shared by plus, min, tafels and delen.

```ts
interface VariationLayout {
  perBlock: number
  counts: { result: number; lhs: number; rhs: number }
}
```

Each count is a number of **blocks** of `perBlock` exercises; total = `perBlock × (result + lhs + rhs)`.
Blocks are emitted **result…, rhs…, lhs…**; the config panel lists them **result, lhs, rhs**. Why: the sheet order is legacy, the panel order is the readable one.

## Blanks

`Block.blank` names the slot the pupil fills in: `...` on the pupil sheet, bold on the answer sheet. It is a property of the **block**, not of the exercise — every exercise in a block hides the same slot.

## Drawing

- `roundRobinSource` guarantees only this: the draw counts of any two candidate groups differ by at most one.
- `withNoRepeatWithinBlock` is best-effort — when a pool is smaller than a block it prints duplicates rather than failing the sheet. breuken does not use it.
- Blocks from one pool never share an exercise; `assemble` slices one flat draw front-to-back.

## Caps

| Constant        | Value | Meaning                                  |
| --------------- | ----- | ---------------------------------------- |
| `MAX_EXERCISES` | 500   | per sheet; over it, `TOO_MANY_EXERCISES` |
| `MAX_PER_BLOCK` | 20    | `perBlock` upper bound (min 1)           |
| `MAX_BLOCKS`    | 40    | each block count's upper bound           |
| `MIN_RANGE_MAX` | 1000  | upper bound of plus/min number ranges    |
