Status: CONTRACT
Owns: the random number generator
Read with: [../domain.md](../domain.md)
Code: src/domain/rng/**

# 0003 — mulberry32 with derived streams

## Context

Worksheets are reproduced from a seed in the URL, and the tests assert determinism. The seed must also be short enough to sit in a readable URL.

## Decision

Use `mulberry32`, seeded by a uint32, written in-repo. Derive a per-section stream with `deriveRng(seed, label)` via an integer hash of the label.

## Consequences

- A uint32 seed base36-encodes in ≤7 URL characters.
- No dependency, ~10 lines of code.
- Per-section streams mean a later builder can re-roll sheet 3 without disturbing sheets 1 and 2.

## Rejected

- **`Math.random`.** Not reproducible: no shareable URLs, no deterministic tests.
- **`seedrandom`.** A dependency for no benefit over ten lines.
- **sfc32 + cyrb128.** Better statistical quality, but 128 bits of state needs a 22-char URL seed for output nobody inspects statistically.
