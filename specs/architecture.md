Status: CONTRACT
Owns: layer boundaries and the src/ tree
Read with: [domain.md](domain.md), [url-state.md](url-state.md)
Code: src/, eslint.config.js

# Architecture

## Layers

| Layer  | Directories                                                         | May import           |
| ------ | ------------------------------------------------------------------- | -------------------- |
| Domain | `src/domain/**`                                                     | `src/domain/**`, zod |
| State  | `src/stores/**`                                                     | domain, `src/lib/**` |
| UI     | `src/app/**`, `src/features/**`, `src/components/**`, `src/i18n/**` | everything below     |

Dependencies point one way: UI → state → domain. The domain never imports upward, and never imports React, the DOM, or a store.

Why: the domain must stay portable to a Node PDF service later, and purity is what makes the generators testable — a generator that reaches for `Math.random` or a DOM node cannot be asserted on.

## Tree

```
src/
  domain/        pure TS — no React, no DOM, no Math.random
    core/        term.ts fraction.ts exercise.ts block.ts result.ts
    rng/         rng.ts mulberry32.ts hash.ts
    sources/     exercise-source.ts round-robin-source.ts rejection-source.ts decorators.ts
    layout/      layout-spec.ts plan-blocks.ts assemble.ts
    generators/  generator.ts registry.ts predicates.ts plus.ts min.ts tafels.ts delen.ts splitsen.ts breuken.ts
    config/      schema.ts defaults.ts limits.ts
    url/         codec.ts params.ts worksheet-url.ts versions.ts
    worksheet/   worksheet-spec.ts generate-worksheet.ts
  app/           router.tsx routes/ layout/
  features/      worksheet-form/ worksheet-preview/ print/ share/
  stores/        worksheet-form-store.ts
  components/ui/ shadcn components
  i18n/          nl.ts — all Dutch UI strings
  lib/           cn.ts analytics.ts random-seed.ts
  styles/        tokens.css index.css
```

| Directory           | Purpose                                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain/core`       | Value types: terms, fractions, exercises, blocks, `Result`                                                                                    |
| `domain/rng`        | Seeded RNG and seed derivation                                                                                                                |
| `domain/sources`    | What exercises exist and how they are drawn                                                                                                   |
| `domain/layout`     | How many blocks of what shape, and assembling them into a `Section`                                                                           |
| `domain/generators` | Per-type strategies plus the registry that maps type → strategy                                                                               |
| `domain/config`     | Zod schemas, defaults, and hard limits                                                                                                        |
| `domain/url`        | Config ↔ query-param codec, URL builder, schema migrations                                                                                    |
| `domain/worksheet`  | `WorksheetSpec` and the one pure `generateWorksheet()`                                                                                        |
| `app`               | Router, route components, page shell and nav                                                                                                  |
| `features`          | Feature-scoped UI: form, preview, print, share                                                                                                |
| `stores`            | Zustand stores — editing buffers only, never rendered truth                                                                                   |
| `components/ui`     | shadcn primitives; no app logic                                                                                                               |
| `i18n`              | Every Dutch UI string                                                                                                                         |
| `lib`               | Cross-cutting helpers with no home elsewhere, including `randomSeed()` — the one deliberate source of nondeterminism, kept outside the domain |
| `styles`            | Tailwind entry and design tokens                                                                                                              |

## Enforcement

`eslint.config.js` carries a block scoped to `src/domain/**/*.ts`:

| Rule                       | Bans                                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `no-restricted-imports`    | `react`, `react-*`, `zustand`, `sonner`; `@/app/*`, `@/features/*`, `@/components/*`, `@/stores/*`, `@/i18n/*` |
| `no-restricted-globals`    | `document`, `window`                                                                                           |
| `no-restricted-properties` | `Math.random`                                                                                                  |
| `no-console`               | all console use                                                                                                |

The boundary is a lint rule, not a convention. Widening it requires editing this doc in the same commit.

## Language

UI is Dutch; code, identifiers, comments, and specs are English. Every Dutch string lives in `src/i18n/nl.ts`.

The domain is string-free: no labels, no icons, no formatting. It emits numbers, operators, and structure; the UI decides how those read.
