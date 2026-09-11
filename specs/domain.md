Status: CONTRACT
Owns: the domain contract — types, sources, layout, generators, RNG, validation
Read with: [architecture.md](architecture.md), [testing.md](testing.md)
Code: src/domain/**

# Domain

## Core types

```ts
type Term = { kind: 'int'; value: number } | { kind: 'frac'; n: number; d: number }
type Operator = '+' | '-' | '×' | ':'
type Slot = 'lhs' | 'rhs' | 'result'
interface Exercise {
  lhs: Term
  operator: Operator
  rhs: Term
  result: Term
}
interface Block {
  id: string
  blank: Slot
  exercises: readonly Exercise[]
}
interface Section {
  id: string
  type: ExerciseType
  blocks: readonly Block[]
}
interface Worksheet {
  title: string
  sections: readonly Section[]
}
```

One universal `Exercise` covers all six types. Why: a future mixed/multi-sheet builder must hold heterogeneous exercises in one array.

Fractions are plain data with free functions in `core/fraction.ts`, not a class. Why: structural equality and JSON-serialisability; a prototype invites mutation. Contract kept from the legacy app: **operands unreduced, result reduced.**

`Section` exists only so a later builder can re-roll one part of a sheet without disturbing the rest. v1 always emits exactly one section.

Student sheet vs answer sheet is **not** in the domain — it is a render mode over one `Worksheet`. Pagination is CSS.

## Three separated concerns

| Concern                    | Owner                            | Question answered              |
| -------------------------- | -------------------------------- | ------------------------------ |
| What exists, how drawn     | `ExerciseSource`                 | which sums are legal           |
| How many boxes, what shape | `LayoutSpec` → `planBlocks()`    | block count and per-block size |
| Which slot is hidden       | `Block.blank`, applied at render | what the pupil fills in        |

Legacy fused all three into per-page jQuery. Keep them apart.

## Sources

`ExerciseSource.draw(count, rng): Exercise[]`. Two implementations:

| Source                                  | Used by                            | Behaviour                                                                                                                           |
| --------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `roundRobinSource(groups)`              | plus, min, tafels, delen, splitsen | each group is a shuffled cycler emitting a full permutation before repeating; group order is shuffled once, then strict round-robin |
| `rejectionSource(attempt, maxAttempts)` | breuken                            | retries a candidate until it satisfies its rule; **bounded** — throws a typed `GenerationError` on exhaustion                       |

Round-robin's only fairness guarantee, inherited from the legacy app: per-group counts differ by at most 1. Nothing stronger is promised.

`rejectionSource` being bounded is the point — the legacy breuken code could loop forever.

`withNoRepeatWithinBlock(source, blockSize)` decorates a source so one box does not print the same sum twice. It is best-effort: when a pool is smaller than a block it allows duplicates rather than failing the sheet.

Rules that narrow which exercises exist (the plus carry rule) are applied when the candidate groups are built, not by filtering draws. Why: a filtered source can run dry; a filtered group cannot.

## Layout

| Kind        | Used by                  | Emits                                                                              |
| ----------- | ------------------------ | ---------------------------------------------------------------------------------- |
| `variation` | plus, min, tafels, delen | blocks in the fixed order **result…, rhs…, lhs…**                                  |
| `flat`      | splitsen                 | N identical blocks, one blank slot                                                 |
| `grouped`   | breuken                  | `add…, sub…, mul…, div…`, each block operator-homogeneous, never shuffled together |

The config panel lists the variation counts **result / lhs / rhs**, but blocks are emitted **result / rhs / lhs**. This is the single easiest thing in the codebase to get wrong. It lives in one tested function, `planBlocks()`; do not reproduce the ordering anywhere else.

## Generators

```ts
interface ExerciseGenerator<C extends ExerciseConfig> {
  type: C['type']
  defaults: C
  layout(config: C): LayoutSpec
  sources(config: C): Readonly<Record<string, ExerciseSource>>
  validate(config: C): Result<C>
  codec: ConfigCodec<C>
}
function generateSection(config: ExerciseConfig, rng: Rng, id: string): Section
function generateWorksheet(spec: WorksheetSpec): Worksheet // pure, total
```

There is deliberately **no `generate()` method**: generation is one shared pure function over layout + sources. A seventh exercise type is one file in `generators/` plus one registry entry.

## RNG

`mulberry32`, seeded by a uint32. Why: base36-encodes in ≤7 URL chars and needs no dependency.

```ts
interface Rng {
  nextFloat(): number
  int(minIncl: number, maxIncl: number): number
  shuffle<T>(items: readonly T[]): T[]
}
function deriveRng(seed: number, label: string): Rng
```

`shuffle` returns a **new** array; the domain never mutates its inputs.

`deriveRng` mixes the seed with an integer hash of the label so each section gets its own stream. Why: without it, editing sheet 3 in the future builder re-rolls sheets 1 and 2.

Picking a seed is the one deliberate source of nondeterminism, so `randomSeed()` lives in `src/lib/random-seed.ts`, outside the domain. `Math.random` is lint-banned inside `src/domain/**`.

## Validation

Validation returns `Result<C>` — `{ ok: true, value }` or `{ ok: false, issues }` — and never throws. Throwing is reserved for programmer errors and `GenerationError`. `generateSection` returns a section with no blocks for a config that fails validation, so an invalid URL renders an empty sheet rather than crashing.

| Code                 | Raised when                                  |
| -------------------- | -------------------------------------------- |
| `EMPTY_SELECTION`    | no tafel, splits number or divisor selected  |
| `NO_EXERCISES`       | every block count is 0                       |
| `TOO_MANY_EXERCISES` | `perBlock × Σ counts > MAX_EXERCISES`        |
| `INVALID_FIELD`      | a field fails its schema (range, type, enum) |

Zod schemas for every config live in `src/domain/config/schema.ts`; the generator's `validate` adds the cross-field rules the schema cannot express. `MAX_EXERCISES = 500`.
