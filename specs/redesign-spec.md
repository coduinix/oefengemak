# Oefengemak Redesign — Specification (v1)

## Goal

Build a modern, desktop-first, frontend-only worksheet generator for Oefengemak, aimed at teachers at primary schools in the Netherlands. The application should feel responsive and interactive while remaining lightweight. Worksheets are stored entirely in the URL so they can be bookmarked and shared without requiring a backend.

The visual design is provided separately (`specs/frontpage-design.png`) and should be followed closely for style and colors.

v1 replaces the current Jekyll site's exercise generation with the same functional scope, restyled and rebuilt on a modern stack. The drag-and-drop multi-sheet "designer/builder" and accounts are later phases, out of scope here.

---

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Zustand
- Lucide Icons

dnd-kit is deferred until the drag-and-drop builder phase. Avoid introducing additional frameworks unless there is a clear benefit — no SSR/SSG framework is used in v1 (see SEO below).

---

## Design Principles

- Desktop-first (mobile support later)
- Fast interactions
- Minimal animations (functional, not flashy)
- Accessible components (Radix/shadcn defaults)
- Consistent design system
- Stateless architecture where possible

---

## SEO / Rendering

The app is a plain client-side rendered SPA in v1 — no prerendering or SSR. This is an accepted tradeoff: search engines will see an empty shell until JS executes. Revisit (e.g. with prerendering or a move to an SSR-capable framework) if organic search traffic becomes a priority once the site is live.

---

## Application Structure

```
App
├── Landing page
├── Over
├── Doneren
├── Werkbladen (later becomes a "designer"/"builder")
│   ├── Splitsen
│   ├── Plus
│   ├── Min
│   ├── Tafels
│   ├── Delen
│   └── Breuken
└── Account (later)
```

## Routing

```
/
/sommen/splitsen
/sommen/plus
/sommen/min
/sommen/tafels
/sommen/delen
/sommen/breuken
/about       (Over)
/doneren
```

All six exercise types from the current site ship in v1: Splitsen, Plus, Min, Tafels, Delen, Breuken.

---

## Redirects from the Old Site

The current Jekyll site uses its own URL structure and has existing search ranking/backlinks. Add permanent redirects from old URLs to the new `/sommen/...` routes only if this is low-maintenance on the chosen static host (e.g. a flat redirects config file, not a custom routing layer). If it turns into ongoing maintenance overhead, skip it and accept a clean break.

---

## Exercise Generation Logic

The existing `js/generator.js` and `js/{exercise-type}.js` logic is **not** ported — it is rewritten from scratch in TypeScript, using the old code only as a behavioral reference (number ranges, variation types, shuffling behavior, etc.).

The new data model should be designed with the future mixed/multi-sheet builder in mind (composable exercise definitions, not one-off per-page logic), even though that builder UI ships in a later phase.

---

## Worksheet State

Worksheet configuration (exercise type, options, generated exercises) is encoded entirely in the URL, so a worksheet can be bookmarked or shared with no backend involved.

**Open item:** the exact encoding scheme (query params vs. a compact serialized/compressed string, schema versioning strategy, size limits per exercise type, and behavior once multi-sheet configurations exist) still needs to be designed during implementation.

---

## Printing & Export

- Browser print dialog via print-optimized CSS — same mechanism as today (`window.print()`).
- **New in v1:** native PDF export/download, generated client-side, so a teacher can save or email a worksheet without relying on "print to PDF" in their browser.

---

## Doneren (Donations)

Goal: a donation experience with the simplicity of Ko-fi, but supporting Dutch-preferred payment rails (iDEAL / Wero), since Ko-fi itself does not support iDEAL directly.

**Open item:** this needs a short research spike to pick a provider (e.g. a Mollie-based donation flow, or another iDEAL-capable service) before it can be fully specced. Not blocking for the rest of v1.

---

## Analytics

Google Analytics (currently embedded site-wide) is replaced with a privacy-friendly analytics tool (e.g. Plausible, Fathom, or self-hosted) — a better fit for the AVG/GDPR-sensitive schools audience, and likely avoids needing a cookie consent banner.

---

## Hosting

A static host — Netlify, Vercel, or Cloudflare Pages. Specific choice still to be made; the architecture does not depend on which one is used.

---

## Explicitly Out of Scope for v1

- Drag-and-drop worksheet builder / mixed & multi-sheet ("full week") configuration tool
- Accounts
- Mobile-optimized layout
- SSR/prerendering

---

## Open Items

1. Exact URL-state encoding scheme for worksheets (format, versioning, size limits).
2. Donation payment provider that supports iDEAL/Wero with Ko-fi-like simplicity.
3. Which static host, specifically.
4. Whether redirects from the old site are feasible without added maintenance burden, once the host is chosen.
