Status: CONTRACT
Owns: how a worksheet reaches paper
Read with: [../product.md](../product.md)
Code: src/features/print/**, src/styles/**

# 0005 — Print CSS, not a PDF library

## Context

A teacher needs an oefenblad on A4, and sometimes as a file to email.

## Decision

Print-optimised CSS plus `window.print()` this phase. Native PDF export is deferred.

## Consequences

- Pagination is CSS, so the answer sheet is a render mode over the same `Worksheet`.
- Teachers who need a file use their browser's print-to-PDF.
- Revisit if that proves to be a real friction point; the domain being DOM-free keeps a server-side PDF route open.

## Rejected

- **jsPDF / html2canvas now.** Rasterised text that prints badly and cannot be selected, a large bundle for a v1, and browsers' print-to-PDF already covers the need.
