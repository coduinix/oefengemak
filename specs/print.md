Status: CONTRACT
Owns: print CSS, A4 geometry, pagination, and the answer sheet
Read with: [ui-pages.md](ui-pages.md), [decisions/0005-print-css-not-pdf-lib.md](decisions/0005-print-css-not-pdf-lib.md), [decisions/0007-js-measured-pagination.md](decisions/0007-js-measured-pagination.md)
Code: src/features/print/print.css, src/features/print/usePrint.ts, src/features/print/paginate.ts, src/features/print/geometry.ts, src/features/worksheet-preview/usePaginatedBlocks.ts

# Print

## Mechanism

Print-optimised CSS plus `window.print()`. Native PDF export is deferred; teachers who need a file use the browser's print-to-PDF. See [decisions/0005-print-css-not-pdf-lib.md](decisions/0005-print-css-not-pdf-lib.md).

`print.css` is imported by `WorksheetPreview`, so it loads only on a page that can print.

## Geometry

```css
@page {
  size: A4;
  margin: 10mm;
}
```

`.worksheet-page` is the real A4 page: `width: 210mm`, `height: 297mm`, `padding: 12mm`, white surface, hairline border, `--shadow-soft`. On screen it is rendered at true size and then scaled down as a whole (see "On-screen scaling" below) so the teacher sees the page break before printing. `.worksheet-sheet` groups one sheet's pages and carries no box styling of its own.

In print every one of `.worksheet-page`'s screen styles is stripped — no width/height, no padding, no border, no radius, no shadow — because `@page` already owns the margin.

## Class contract

These class names are the contract between the preview components and the stylesheet. Renaming one means editing both.

| Class                   | On screen                                              | In print                                       |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `.worksheet-sheet`      | groups one sheet's pages; no box styling of its own    | `width`/`height` forced back to `auto`         |
| `.worksheet-page`       | one A4-proportioned page of paper                      | flat; `break-after: page`, `auto` on the last  |
| `.worksheet-page--last` | (marker only)                                          | `break-after: auto`                            |
| `.worksheet-scale`      | the fit-to-viewport `transform: scale(...)` wrapper    | reset to `position: static; transform: none`   |
| `.worksheet-block`      | a bordered box of exercises                            | `break-inside: avoid`                          |
| `.worksheet-preview`    | `flex flex-col` with a `gap-10` between the two sheets | `display: block`, `gap: 0`                     |

## Pagination

On-screen block-to-page assignment is computed in JS, not left to native reflow: `usePaginatedBlocks` measures every block's real rendered height (via a hidden `MeasurementProbe`, see [ui-pages.md](ui-pages.md)) and `paginateBlocks` (`src/features/print/paginate.ts`, pure and DOM-free) chunks the flattened block list into pages that fit an A4 page's content height, simulating the same row-major 4-column packing the grid itself uses.

Print is then forced to match that exact chunking: `break-after: page` on every `.worksheet-page`, overridden to `break-after: auto` on `.worksheet-page--last` — which `SheetView` applies only to the true last page of the whole two-sheet document (not via `:last-child`, which would independently match the last page of both the student sheet and the answer sheet). `break-inside: avoid` on every block keeps a box of sums whole across a page boundary as a defensive net.

This refines, not reverses, [decisions/0005-print-css-not-pdf-lib.md](decisions/0005-print-css-not-pdf-lib.md) — `window.print()` and `@page`/`break-after` remain the print mechanism; only *which blocks land on which page* is now decided ahead of time in JS instead of left to native reflow. See [decisions/0007-js-measured-pagination.md](decisions/0007-js-measured-pagination.md) for why.

## On-screen scaling

The preview always renders at fixed A4 proportions (four columns, matching print), never a responsive grid. `useFitWidth` (`src/features/worksheet-preview/useFitWidth.ts`) measures the available width and scales the whole natural-size sheet down via `transform: scale(...)` on `.worksheet-scale`, like a document viewer — never scaling up, and never below a minimum readable floor. Below that floor the wrapper (`.worksheet-preview`, `overflow-x: auto`) lets the page overflow and scroll horizontally instead of shrinking text further.

The landing page's decorative `.example-sheet` thumbnail uses the same `.worksheet-page` box, scaled with a fixed CSS `transform`, independently of `useFitWidth` — it's static and doesn't need JS measurement for a purely cosmetic example.

## Two sheets, always

Printing always emits the pupil sheet and then the answer sheet. There is no toggle and no setting. Inherited from the legacy site, because teachers asked for it: the answer sheet is what makes the worksheet usable in a classroom.

The answer sheet is a render mode over the same `Worksheet`, not a second generation — see [ui-pages.md](ui-pages.md). The two sheets may each span a different number of pages; a heavier, labelled divider (`.worksheet-sheet-break`, `print:hidden`) marks the seam between them on screen, visually distinct from the dotted `.worksheet-page-break` between two pages of the same sheet.

## What is hidden

The header, the footer, the page heading, the config panel, the empty state and toasts all carry Tailwind's `print:hidden`. Hiding is always done that way, on the element itself — `print.css` holds no hiding rules of its own. The two on-screen-only divider elements (`.worksheet-page-break`, `.worksheet-sheet-break`) follow the same rule.

## The one global reach

Inside `@media print`, `print.css` resets `html`, `body` and `#root` — margin, padding, max-width, background. Those three elements belong to no component, so nothing else can reset them. `AppLayout`'s `<main>` resets itself with `print:max-w-none print:p-0`.

**No further global selectors may be added to `print.css`.** Anything else that needs print behaviour gets a `print:` utility on its own element.

## Analytics

`usePrint(type)` returns the print handler; it fires `trackEvent('Oefenblad', 'print', …)` alongside `window.print()`. Printing is the product's conversion event.

## Open

- Page-break behaviour has only been verified in Chromium. Firefox and Safari are untested.
- Native PDF export is a later phase, not a v1 gap.
- The measurement probe re-measures continuously (its `ResizeObserver` never stops), so a late web-font swap corrects pagination automatically; it does not currently re-measure on an explicit `document.fonts.ready` signal, only on layout changes that already fire the observer.
