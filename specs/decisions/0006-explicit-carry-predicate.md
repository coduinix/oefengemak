Status: CONTRACT
Owns: the no-carry (tientaloverschrijding) rule
Read with: [../domain.md](../domain.md)
Code: src/domain/generators/predicates.ts, src/domain/generators/plus.ts

# 0006 — No-carry is an explicit predicate

## Context

The legacy "t/m 20 zonder tientaloverschrijding" option worked by forcing `lhs >= 10` and letting the no-carry property emerge from that constraint. As a result `3 + 12 = 15` never appeared — only `12 + 3`. The label said one thing; the code did another, and nothing tested the difference.

## Decision

Make it an explicit, testable predicate: `(lhs % 10) + (rhs % 10) <= 10`.

## Consequences

- Generated sheets differ from today's: the option now means what its label says, and small-first sums appear.
- The rule is one line, property-testable across every generated exercise.
- A separate `mo` (minOperand) config param reproduces the legacy shape for anyone who wants it.

## Rejected

- **Legacy parity.** An emergent property nobody can test, explain, or change safely.
