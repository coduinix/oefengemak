Status: CONTRACT
Owns: what is tested and how
Read with: [domain.md](domain.md), [url-state.md](url-state.md)
Code: src/**/\*.test.ts, src/**/*.test.tsx

# Testing

Vitest for everything; fast-check for properties.

## The split

The domain layer and the URL codec are thoroughly unit- and property-tested.

React gets exactly two files, and nothing more in this phase:

| File                                           | Asserts                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/routes/__tests__/routes.test.tsx`         | each route mounts and shows its heading; an unknown path or type falls through to the 404                                                                                                                                                                                                                                                                       |
| `app/routes/__tests__/worksheet-page.test.tsx` | per type: two sheets render, one of them the `Antwoordenvel`; the same URL renders the same sums; a garbage URL loads defaults; an empty selection disables `Maak oefenblad`; there is no separate regenerate button, and each click of `Maak oefenblad` pushes the edited form values with a fresh seed; the answer sheet has answers the pupil sheet does not |

Do not add component tests by reflex. The logic worth asserting on lives in `src/domain`; the second file exists only because "the URL is the worksheet" and "two sheets always print" are end-to-end promises that no unit test can cover.

## Cross-cutting properties

Driven by the generator registry, so a new exercise type inherits all of them for free.

| Property         | Assertion                                                                          |
| ---------------- | ---------------------------------------------------------------------------------- |
| Soundness        | for every exercise, `applyOperator(lhs, op, rhs) === result`                       |
| Determinism      | same config + same seed ⇒ deeply equal `Worksheet`                                 |
| URL round-trip   | `generateWorksheet(decode(encode(spec)))` deep-equals `generateWorksheet(spec)`    |
| Decoder totality | fuzz arbitrary query strings: `decode` always returns a valid config, never throws |
| Counts           | total exercises `= perBlock × Σ block counts`, and `≤ MAX_EXERCISES`               |
| Block order      | matches the type's `LayoutSpec` kind — `variation` is result…, rhs…, lhs…          |

## Golden snapshots

One snapshot per exercise type at a fixed seed and a fixed config.

This is a **drift detector, not a correctness test**. A diff means generated output changed; the job is then to decide consciously whether that change warrants bumping `v` in the URL schema. Never update a golden without making that call.

## Validation and no-crash

Inherited from the legacy bug list. Each must yield a `ValidationIssue`, never a crash or an empty render:

| Input                       | Expected code        |
| --------------------------- | -------------------- |
| empty tafels selection      | `EMPTY_SELECTION`    |
| empty splitsen selection    | `EMPTY_SELECTION`    |
| empty delen selection       | `EMPTY_SELECTION`    |
| all block counts zero       | `NO_EXERCISES`       |
| `perBlock <= 0`             | `INVALID_FIELD`      |
| `perBlock × Σ counts > 500` | `TOO_MANY_EXERCISES` |

`rejectionSource` exhaustion must surface as a typed `GenerationError`, not a hang.

## Per-type invariants

Brief and type-local — they live in `specs/exercises/*.md`, not here.
