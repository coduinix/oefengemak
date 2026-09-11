Status: CONTRACT
Owns: the breuken generator — sampling, fraction display, layout, invariants, params
Read with: [README.md](README.md), [../domain.md](../domain.md)
Code: src/domain/generators/breuken.ts, src/domain/core/fraction.ts, src/domain/**tests**/generators.test.ts

# Breuken

## Config

```ts
type FractionOp = 'add' | 'sub' | 'mul' | 'div'
interface BreukenConfig {
  type: 'breuken'
  maxDenominator: 10 | 50 | 100
  perBlock: number
  counts: Record<FractionOp, number>
}
```

| Field            | Default                      | Bounds           |
| ---------------- | ---------------------------- | ---------------- |
| `maxDenominator` | `10`                         | 10 \| 50 \| 100  |
| `perBlock`       | `5`                          | 1…20             |
| `counts`         | `add 4, sub 4, mul 4, div 4` | each 0…40 blocks |

## Candidate exercises

Sampled, not enumerated — one `rejectionSource` per operator. Each attempt draws two independent
**proper** fractions (`d ∈ 2..maxDenominator`, `0 < n < d`), applies the operator, reduces, and
**rejects a negative result** — which only subtraction can produce. Division never sees a zero
divisor because operands always have `n >= 1`. Sampling is bounded at
`ATTEMPTS_PER_EXERCISE = 100` attempts per requested exercise and throws `GenerationError` on
exhaustion rather than hanging; a subtraction-only sheet rejects roughly half its samples and
still succeeds.

**Operands are printed unreduced, the result reduced** (`a/b + c/d` keeps denominator `b·d` until
the result is reduced). `withNoRepeatWithinBlock` is not applied — a block may repeat an exercise.

## Display

`toMixed(f)` reduces and returns `{ whole, n, d }`; render that as follows. Markup: [../ui-pages.md](../ui-pages.md).

| Case          | Rendered as                        | Example                  |
| ------------- | ---------------------------------- | ------------------------ |
| `n === 0`     | `whole` alone                      | `3/3` → `1`, `0/5` → `0` |
| `whole !== 0` | `whole` plus the stacked remainder | `7/3` → `2 1/3`          |
| otherwise     | stacked `n` over `d`               | `2/5`                    |

## Layout

`grouped`: one pool per operator, blocks emitted **add…, sub…, mul…, div…** in that fixed order,
each block operator-homogeneous and blanking `result`. Blocks are never shuffled together.
Total exercises = `perBlock × (add + sub + mul + div)`.

## Invariants

- Both operands are `frac` terms with `2 <= d <= maxDenominator` and `0 < n < d`.
- `result` is a `frac`, non-negative, fully reduced (`gcd(n, d) === 1`, or `n === 0`), and equals the operator applied to the operands.
- Each block holds one operator; block operators run `+ - × :`.
- Every planned block is filled completely; deterministic per seed; total ≤ `MAX_EXERCISES`.

## URL params

Shared `v`/`s`/`t`: see [../url-state.md](../url-state.md). Own params: `den` (`maxDenominator`,
default 10), `pb` (perBlock, default 5), and `add` / `sub` / `mul` / `div` (blocks per operator,
default 4 each).

## Edge cases

All four counts 0 → `NO_EXERCISES`; total over the cap → `TOO_MANY_EXERCISES`. Both render an empty section.
