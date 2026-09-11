Status: CONTRACT
Owns: the rendering model
Read with: [../product.md](../product.md)
Code: index.html, src/app/**

# 0004 — No SSR in v1

## Context

The site has existing organic search traffic. A React SPA renders nothing until JS executes.

## Decision

Ship v1 as a plain client-side rendered SPA. No SSR, no prerendering.

## Consequences

- Search engines see an empty shell until JS runs. Accepted.
- Revisit once the new site is live and the actual organic-search impact is measurable — prerendering the static pages is the cheap first step.

## Rejected

- **Next.js or Astro.** A framework migration, and a permanent complexity cost, for an SEO outcome nobody has measured yet.
