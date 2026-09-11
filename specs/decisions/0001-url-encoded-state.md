Status: CONTRACT
Owns: how worksheet state is encoded
Read with: [../url-state.md](../url-state.md)
Code: src/domain/url/**

# 0001 — Config + seed in readable query params

## Context

A worksheet must be bookmarkable and shareable with no backend. The whole worksheet therefore lives in the URL.

## Decision

Encode the config as readable query params plus a uint32 seed. Regenerate exercises from the seed; never serialize them.

## Consequences

- URLs are ~110 chars and hand-editable.
- Generation must be pure and seeded, which is what makes it testable.
- Config is stable across releases; exercises are not. Changing a generator makes an old link render different sums. `v` is the escape hatch.

## Rejected

- **Serialized exercises.** 3–5 KB URLs, and two sources of truth (config and sums) that can drift apart and contradict each other.
- **An opaque compressed blob.** Not hand-editable, all-or-nothing forward compatibility, and it buys roughly 40 bytes at single-sheet scale.
