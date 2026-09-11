Status: CONTRACT
Owns: print CSS, A4 geometry, pagination, and the answer sheet
Read with: [ui-pages.md](ui-pages.md), [decisions/0005-print-css-not-pdf-lib.md](decisions/0005-print-css-not-pdf-lib.md)
Code: src/features/print/print.css, src/features/print/usePrint.ts

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

On screen `.worksheet-sheet` is a paper metaphor: `max-width: 190mm`, `min-height: 267mm`, `padding: 12mm`, white surface, hairline border, `--shadow-soft`, centred. Why: the teacher sees the page break before printing.

In print every one of those is stripped — no max-width, no min-height, no padding, no border, no radius, no shadow — because `@page` already owns the margin.

## Class contract

These three class names are the contract between the preview components and the stylesheet. Renaming one means editing both.

| Class                | On screen                                | In print                                      |
| -------------------- | ---------------------------------------- | --------------------------------------------- |
| `.worksheet-sheet`   | one A4-proportioned sheet of paper       | flat; `break-after: page`, `auto` on the last |
| `.worksheet-block`   | a bordered box of exercises              | `break-inside: avoid`                         |
| `.worksheet-preview` | `grid` with a `gap-6` between the sheets | `display: block`, `gap: 0`                    |

## Pagination

`break-after: page` on `.worksheet-sheet`, overridden to `break-after: auto` by `:last-child` so the document does not end in a blank page. `break-inside: avoid` on every block keeps a box of sums whole across a page boundary.

## Two sheets, always

Printing always emits the pupil sheet and then the answer sheet. There is no toggle and no setting. Inherited from the legacy site, because teachers asked for it: the answer sheet is what makes the worksheet usable in a classroom.

The answer sheet is a render mode over the same `Worksheet`, not a second generation — see [ui-pages.md](ui-pages.md).

## What is hidden

The header, the footer, the page heading, the config panel, the empty state and toasts all carry Tailwind's `print:hidden`. Hiding is always done that way, on the element itself — `print.css` holds no hiding rules of its own.

## The one global reach

Inside `@media print`, `print.css` resets `html`, `body` and `#root` — margin, padding, max-width, background. Those three elements belong to no component, so nothing else can reset them. `AppLayout`'s `<main>` resets itself with `print:max-w-none print:p-0`.

**No further global selectors may be added to `print.css`.** Anything else that needs print behaviour gets a `print:` utility on its own element.

## Analytics

`usePrint(type)` returns the print handler; it fires `trackEvent('Oefenblad', 'print', …)` alongside `window.print()`. Printing is the product's conversion event.

## Open

- Page-break behaviour has only been verified in Chromium. Firefox and Safari are untested.
- Native PDF export is a later phase, not a v1 gap.
