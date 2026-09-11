Status: CONTRACT
Owns: design tokens, colour, typography, shape, and how shadcn components are written
Read with: [ui-pages.md](ui-pages.md)
Code: src/styles/tokens.css, src/styles/index.css, src/components/ui/\*\*

# Design system

## The one rule

**Every colour lives in `src/styles/tokens.css` as a CSS custom property. No hex value may appear anywhere else** — not in a component, not in another stylesheet.

Tokens reach Tailwind v4 through the `@theme inline` block in `src/styles/index.css`, which republishes each `--x` as `--color-x`. There is **no `tailwind.config.js`**; adding a colour means one line in `tokens.css` and one in `@theme inline`.

## Base tokens

| Token         | Value                           | Use                                    |
| ------------- | ------------------------------- | -------------------------------------- |
| `--brand`     | `#2b6cd2`                       | primary actions, links, focus ring     |
| `--brand-ink` | `#0b1f4d`                       | headings and emphasised text           |
| `--ink`       | `#334155`                       | body text                              |
| `--ink-muted` | `#68707a`                       | secondary text, operators on the sheet |
| `--line`      | `#e7eaf0`                       | every border and rule                  |
| `--surface`   | `#ffffff`                       | cards, header, footer, paper           |
| `--canvas`    | `#f5f8fb`                       | page background                        |
| `--danger`    | `#d2453f`                       | validation messages                    |
| `--focus`     | `color-mix(… var(--brand) 45%)` | translucent focus wash                 |

## Per-type pairs

One tint/accent pair per exercise type. The tint is a card or band background; the accent is its icon and text on that tint. They identify a type at a glance on the landing page and in the header; they are never used as generic UI colours.

| Type     | `--tint-*` | `--accent-*` |
| -------- | ---------- | ------------ |
| splitsen | `#fef3ee`  | `#fc7960`    |
| plus     | `#f1faf7`  | `#3faf95`    |
| min      | `#f4f1fd`  | `#8b6fe0`    |
| tafels   | `#fefaec`  | `#e6a310`    |
| delen    | `#fef2f4`  | `#e8709b`    |
| breuken  | `#ecf3fe`  | `#2b6cd2`    |

`--tint-splitsen` doubles as the support/donate band; `--tint-breuken` doubles as `--accent`.

## shadcn semantic variables

shadcn components address these, never a base token directly.

| Variable                                                                | Maps to          |
| ----------------------------------------------------------------------- | ---------------- |
| `--background`, `--secondary`, `--muted`                                | `--canvas`       |
| `--foreground`, `--card-foreground`                                     | `--ink`          |
| `--card`, `--popover`                                                   | `--surface`      |
| `--primary`, `--ring`                                                   | `--brand`        |
| `--secondary-foreground`, `--accent-foreground`, `--popover-foreground` | `--brand-ink`    |
| `--muted-foreground`                                                    | `--ink-muted`    |
| `--border`, `--input`                                                   | `--line`         |
| `--accent`                                                              | `--tint-breuken` |
| `--destructive`                                                         | `--danger`       |
| `--primary-foreground`, `--destructive-foreground`                      | `#ffffff`        |

## Typography

| Utility        | Stack                                    | Use                                   |
| -------------- | ---------------------------------------- | ------------------------------------- |
| `font-display` | Fraunces, then old-style serif fallbacks | `h1`–`h4`, card titles, wordmark      |
| `font-sans`    | Nunito Sans, then system sans            | all UI text; `body` default           |
| `worksheet`    | `--font-worksheet` + `tabular-nums`      | every exercise row and splits diagram |

`worksheet` is a custom `@utility`, not a font token: it applies the worksheet font stack **and** `font-variant-numeric: tabular-nums`. Why: digits must align in the worksheet's narrow right-aligned columns.

`@layer base` sets `h1`–`h4` to `font-display`, weight 600, colour `--brand-ink`. Do not restate that per heading.

## Shape and motion

- Radius: `--radius: 1rem`, exposed as Tailwind `rounded-card`. Cards use `rounded-2xl`, buttons and inputs `rounded-xl`, worksheet blocks `rounded-md`.
- `--shadow-soft` — resting elevation: cards, the default button, the on-screen paper sheet.
- `--shadow-lift` — raised elevation: hover on a landing-page type card, the Sommen dropdown, toasts.
- Motion is limited to hover colour/shadow transitions and focus rings. No entrance animation, no parallax, no scroll effect. Why: the product is a form and a sheet of paper.

## shadcn policy

Components are **hand-written** in `src/components/ui/` in the shadcn idiom — Radix primitive plus `cva` variants plus `cn()` — and are **not** generated by the shadcn CLI. Why: the CLI writes its own token names and a `components.json` we would then have to keep in sync with `@theme inline`.

Existing: `button`, `card`, `checkbox`, `input`, `label`, `radio-group`, `select`, `separator`, `toaster` (sonner wrapper).

- Style through the semantic variables (`bg-primary`, `text-ink-muted`, `border-line`); never a raw colour.
- Every interactive component carries a visible `focus-visible:ring-2 focus-visible:ring-ring` — `button`, `input`, `checkbox`, `radio-group`, `select` all do. A new interactive component without one is incomplete.
- `components/ui` holds no app logic and imports nothing from `features/` or `domain/`.

## Light theme only

There is no dark palette, no `.dark` block, no theme toggle. Why: the output is printed paper, and a second palette would double the token surface for a screen state nobody prints.
