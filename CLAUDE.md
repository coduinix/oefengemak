# CLAUDE.md

## What this is

**Oefengemak.nl** — a Dutch site where primary-school teachers generate and print practice
worksheets (oefenbladen): splitsen, plus, min, tafels, delen and breuken.

Frontend-only SPA: React 19, TypeScript, Vite, Tailwind v4, shadcn/ui, Zustand, React Router.
No backend. A worksheet is encoded entirely in its URL, so it can be bookmarked and shared.

The legacy Jekyll + jQuery site was replaced wholesale on the `redesign` branch. It survives in
git history and is a behavioural reference only — never a thing to port from.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # typecheck + production build to dist/
npm run test       # Vitest, full suite
npm run lint       # ESLint
npm run format     # Prettier
```

## Where the "why" lives

Design and rationale live in `specs/`. **Start at `specs/README.md`** and follow its routing
table — it tells you which one or two docs your task needs. Do not skip it for non-trivial work,
and do not read the whole tree.

`specs/decisions/` holds the ADRs: what was rejected, and why.

## Rules that hold even if you read no spec

- `src/domain/**` is pure: no React, no DOM, no `Math.random`, no `console`. Use the injected
  `Rng`. A lint rule enforces this — it is a boundary, not a convention.
- UI text is Dutch; code, identifiers, comments and specs are English. Every Dutch string lives
  in `src/i18n/nl.ts`. The domain is string-free.
- Colours and type come from Tailwind tokens. No hex value may appear outside
  `src/styles/tokens.css`.
- The URL is the source of truth for the rendered worksheet; Zustand is only the form's editing
  buffer. Generation happens on URL change, never on keystroke.
- Comments explain non-obvious _local_ choices only. Architectural reasoning belongs in `specs/`,
  rejected alternatives in `specs/decisions/`. Do not narrate what the code already says.

## Keeping specs honest

A spec marked `CONTRACT` describes behaviour the code must satisfy. Changing that behaviour means
editing the spec in the same commit. A spec marked `SNAPSHOT` records intent at a date and is
never edited to match reality.

When a contract and the code disagree, that is a bug — report it, do not silently follow the code.
