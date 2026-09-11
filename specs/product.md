Status: SNAPSHOT (dated 2026-09-11)
Owns: product scope, routes, and the v1 boundary
Read with: [README.md](README.md), [architecture.md](architecture.md)
Code: src/app/routes/**

# Product

## Goal

A desktop-first, frontend-only worksheet generator for Oefengemak, aimed at teachers at Dutch primary schools. Fast and interactive, but lightweight. A worksheet lives entirely in its URL, so it can be bookmarked and shared with no backend.

v1 replaces the Jekyll site's exercise generation with the same functional scope, restyled and rebuilt. The drag-and-drop multi-sheet builder and accounts are later phases.

Visual reference: `specs/frontpage-design.png`. Follow it closely for style and colour.

## Stack

React 19, TypeScript, Vite, React Router, Tailwind v4, shadcn/ui, Zustand, Lucide.

dnd-kit is deferred to the builder phase. No SSR/SSG framework (ADR 0004). Add no further frameworks without a clear benefit.

## Principles

- Desktop-first; mobile later.
- Fast interactions, minimal animation — functional, not flashy.
- Accessible by default via Radix/shadcn.
- Stateless where possible: the URL, not a server, holds the worksheet.

## Structure

```
App
├── Landing page
├── Over
├── Doneren
├── Werkbladen (later becomes a builder)
│   ├── Splitsen
│   ├── Plus
│   ├── Min
│   ├── Tafels
│   ├── Delen
│   └── Breuken
└── Account (later)
```

## Routes

| Route              | Page     |
| ------------------ | -------- |
| `/`                | Landing  |
| `/sommen/splitsen` | Splitsen |
| `/sommen/plus`     | Plus     |
| `/sommen/min`      | Min      |
| `/sommen/tafels`   | Tafels   |
| `/sommen/delen`    | Delen    |
| `/sommen/breuken`  | Breuken  |
| `/about`           | Over     |
| `/doneren`         | Doneren  |

All six exercise types ship in v1.

## Exercise generation

The legacy `js/*.js` is a behavioural reference only, not ported (ADR 0002). One notable intentional behaviour change: the no-carry plus option now means what its label says (ADR 0006), so generated sheets differ from today's.

The data model is built for the future mixed/multi-sheet builder — composable exercise definitions, not per-page logic — even though that UI ships later. See `domain.md`.

## Worksheet state

Config plus a seed in readable query params; exercises are regenerated, never serialized. Owned by `url-state.md`.

## Printing

Browser print dialog over print-optimised CSS, as today. Native PDF export is **deferred**, not v1 (ADR 0005) — teachers use their browser's print-to-PDF meanwhile.

## Analytics

Replace Google Analytics with a privacy-friendly tool (Plausible, Fathom, or self-hosted): a better fit for an AVG/GDPR-sensitive schools audience, and likely avoids a cookie banner.

## Doneren

Goal: the simplicity of Ko-fi, but on Dutch payment rails (iDEAL / Wero), which Ko-fi does not support directly. Not blocking for the rest of v1.

## Redirects from the old site

The Jekyll site has existing ranking and backlinks. Add permanent redirects to the new `/sommen/...` routes only if the chosen host makes it low-maintenance — a flat redirects config file, not a custom routing layer. Otherwise accept a clean break.

## Out of scope for v1

- Drag-and-drop worksheet builder; mixed and multi-sheet ("full week") configuration
- Accounts
- Mobile-optimised layout
- SSR / prerendering
- Native PDF export

## Open

1. Donation payment provider supporting iDEAL/Wero with Ko-fi-like simplicity — needs a short research spike.
2. Which static host (Netlify, Vercel, Cloudflare Pages). The architecture does not depend on the answer.
3. Whether old-site redirects are feasible without maintenance burden, once the host is chosen.

URL encoding, formerly open here, is now decided and owned by `url-state.md`.
