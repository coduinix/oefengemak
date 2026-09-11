Status: CONTRACT
Owns: the relationship to the legacy generator code
Read with: [../domain.md](../domain.md)
Code: src/domain/generators/**

# 0002 — Rewrite the generators, do not port them

## Context

The legacy Jekyll site's `js/generator.js` and `js/{type}.js` implement all six exercise types in jQuery-era JavaScript. They are in git history.

## Decision

Treat the legacy code as a **behavioural reference only** — number ranges, variation types, fairness behaviour — and rewrite the generators from scratch in TypeScript against the domain contract.

## Consequences

- Legacy behaviour is reproduced deliberately, clause by clause, or deliberately changed (see 0006).
- Each reproduced behaviour becomes an assertion instead of an accident.

## Rejected

- **A mechanical port.** It carries over the mutation-heavy in-place shuffle, the fused render/generate logic that made the three concerns inseparable, and the crash on an empty selection.
