# Oefengemak specs

Oefengemak.nl generates printable Dutch arithmetic worksheets (oefenbladen) for primary schools.
Frontend-only SPA: React 19, TypeScript, Vite, Tailwind v4, shadcn/ui, Zustand, React Router.
The code is the source of truth for _what_ happens; these specs are the source of truth for _why_.

## How to read this

Read this file, then only the docs whose row matches your task. Open a further doc only when a doc you are reading names it under _Read with_. Do not read the whole `specs/` tree.

## Routing

| If your task is…                               | Read                                         | Then maybe                                          |
| ---------------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Add or change an exercise generator            | `domain.md`, `exercises/<type>.md`           | `testing.md`, `url-state.md`                        |
| Add a new exercise type                        | `domain.md`, `architecture.md`               | `url-state.md`, `ui-pages.md`, `testing.md`         |
| Change a page's UI or config panel             | `ui-pages.md`                                | `design-system.md`, `url-state.md`                  |
| Styling, colours, or adding a shadcn component | `design-system.md`                           | `ui-pages.md`                                       |
| Change what goes in the URL                    | `url-state.md`                               | `decisions/0001-url-encoded-state.md`, `testing.md` |
| Print, A4 pagination, or the answer sheet      | `print.md`                                   | `decisions/0005-print-css-not-pdf-lib.md`           |
| Add a route, change the shell or nav           | `architecture.md`, `ui-pages.md`             | `product.md`                                        |
| "Where does file X go / may A import B?"       | `architecture.md`                            | —                                                   |
| "Is this in v1?"                               | `product.md`                                 | `decisions/`                                        |
| "What exactly does type X generate?"           | `exercises/README.md`, `exercises/<type>.md` | `domain.md`, `testing.md`                           |

## Docs

| File                    | Status              | Owns                                                 |
| ----------------------- | ------------------- | ---------------------------------------------------- |
| `product.md`            | SNAPSHOT 2026-09-11 | Product scope, routes, v1 boundaries                 |
| `architecture.md`       | CONTRACT            | Layer boundaries and the `src/` tree                 |
| `domain.md`             | CONTRACT            | The domain contract: types, sources, generators, RNG |
| `url-state.md`          | CONTRACT            | The worksheet URL contract and URL↔store direction   |
| `testing.md`            | CONTRACT            | What is tested and how                               |
| `design-system.md`      | CONTRACT            | Tokens, colours, typography, shadcn usage            |
| `ui-pages.md`           | CONTRACT            | Routes, shell, page layouts, config panel, preview   |
| `print.md`              | CONTRACT            | Print CSS, A4 pagination, answer sheet               |
| `exercises/README.md`   | CONTRACT            | Shared exercise option vocabulary and the type index |
| `exercises/splitsen.md` | CONTRACT            | The splitsen generator                               |
| `exercises/plus.md`     | CONTRACT            | The plus generator and the carry rule                |
| `exercises/min.md`      | CONTRACT            | The min generator                                    |
| `exercises/tafels.md`   | CONTRACT            | The tafels generator                                 |
| `exercises/delen.md`    | CONTRACT            | The delen generator                                  |
| `exercises/breuken.md`  | CONTRACT            | The breuken generator and fraction display           |
| `decisions/`            | ADRs (append-only)  | Rejected alternatives and their reasons              |

## Updating

- Changing a CONTRACT subject in code means editing that doc in the same commit.
- A new non-obvious tradeoff means a new ADR in `decisions/`.
- A new spec file means a new row in the tables above — otherwise it is invisible.

## Conflicts

A snapshot and a contract disagree → the contract wins.
A contract and the code disagree → that is a bug. Report it; do not silently follow the code.
