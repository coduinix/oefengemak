Status: CONTRACT
Owns: how the on-screen preview decides which blocks land on which A4 page
Read with: [../print.md](../print.md), [0005-print-css-not-pdf-lib.md](0005-print-css-not-pdf-lib.md)
Code: src/features/print/paginate.ts, src/features/worksheet-preview/usePaginatedBlocks.ts, src/features/worksheet-preview/MeasurementProbe.tsx

# 0007 — JS-measured pagination

## Context

The preview rendered all blocks into one responsive grid; print pagination was decided invisibly
by native reflow. Teachers couldn't see page breaks before printing, and a splitsen diagram, a
plain row, and a fraction block are genuinely different heights, so a static per-type estimate
would misjudge real breaks.

## Decision

Render the preview at fixed A4 proportions (four columns, matching print). Measure every block's
real height with a `ResizeObserver` via an invisible `MeasurementProbe`. Chunk the flattened
block list into pages with a pure function (`paginateBlocks`) simulating the grid's own row
packing. Force print to match: `break-after: page` per `.worksheet-page`, `auto` only on the true
last page of the whole two-sheet document.

## Consequences

- A brief, accepted flash on first paint while the probe measures.
- Probe markup must stay identical to the real render or measured heights drift.
- The probe keeps observing, so a late web-font swap self-corrects without a second flash.
- Resizing the window no longer changes which blocks are "on page 1" — only the on-screen scale.

## Rejected

- Hardcoded per-exercise-type heights — drifts from real CSS/typography.
- Print-time-only pagination, no on-screen page concept — fails "what you see is what prints".

Refines, not reverses, 0005: `window.print()` + `@page`/`break-after` remain the mechanism; JS now
decides block→page assignment ahead of time instead of leaving it to native reflow.
