Status: CONTRACT
Owns: the decision log index and ADR format
Read with: [../README.md](../README.md)
Code: —

# Decisions

| ADR                                         | Decision                                                    |
| ------------------------------------------- | ----------------------------------------------------------- |
| [0001](0001-url-encoded-state.md)           | Worksheet state is config + seed in readable query params   |
| [0002](0002-rewrite-not-port-generators.md) | Legacy `js/*.js` is a behavioural reference, not ported     |
| [0003](0003-seeded-rng.md)                  | mulberry32 with `deriveRng(seed, label)`                    |
| [0004](0004-no-ssr-in-v1.md)                | Plain CSR SPA in v1, no SSR or prerendering                 |
| [0005](0005-print-css-not-pdf-lib.md)       | Print CSS + `window.print()`; native PDF export deferred    |
| [0006](0006-explicit-carry-predicate.md)    | No-carry is an explicit predicate, not an emergent property |
| [0007](0007-js-measured-pagination.md)      | On-screen page breaks computed from measured DOM heights    |

## Format

The five-line spec header, then `# 000X — Title`, then `## Context`, `## Decision`, `## Consequences`, `## Rejected`. Max 30 lines.

ADRs are append-only. Superseding a decision adds a new numbered file and a `Superseded by 00XX` line on the old one — never an in-place rewrite.
