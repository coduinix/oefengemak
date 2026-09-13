Status: CONTRACT
Owns: routes, the app shell, page composition, the config panel, and the worksheet preview
Read with: [design-system.md](design-system.md), [url-state.md](url-state.md)
Code: src/app/\*\*, src/features/worksheet-form/\*\*, src/features/worksheet-preview/\*\*

# UI and pages

## Routes

`src/app/router.tsx` declares one layout route with five children.

| Path            | Component      | Purpose                                         |
| --------------- | -------------- | ----------------------------------------------- |
| `/`             | `HomePage`     | landing: hero, type picker, steps, support band |
| `/sommen/:type` | `SommenPage`   | config panel plus worksheet preview             |
| `/about`        | `AboutPage`    | what Oefengemak is, FAQ                         |
| `/doneren`      | `DonerenPage`  | support/donate                                  |
| `*`             | `NotFoundPage` | catch-all, links back to `/`                    |

## Shell

`AppLayout` renders `SiteHeader`, `<main><Outlet /></main>`, `SiteFooter` in a min-height flex column on `bg-canvas`. `<main>` is `max-w-6xl` centred with `px-4 py-8`, and resets itself for print with `print:max-w-none print:p-0`.

- Header: wordmark linking to `/`, `Home`, a `Sommen` dropdown listing the six types, `Over Oefengemak`, and a tinted `Steun ons` link. The dropdown is a local `useState` menu with `aria-expanded`/`aria-haspopup`, closing on outside pointerdown and on Escape.
- Footer: four columns (Over Oefengemak, Hoe het werkt, Privacy, Contact) plus a copyright line.
- Both carry `print:hidden`. See [print.md](print.md).

## Landing page

Sections in render order: `Hero` (title, body, three feature bullets, over a `notebook-lines` ruled
background; alongside it a rotated `ExampleSheet` — a real `Worksheet` from a fixed seed rendered
through `SheetView`, with a `Paperclip` icon overlay — and a rotated `PostIt` with static copy from
`nl.home.postit`) → a `Card` containing the chooser heading, the six `TypeCard`s (icon, name,
blurb, arrow; tinted per type, `hover:shadow-lift`), `Steps` (three numbered steps), and
`SupportBand` (tinted band with a button to `/doneren`).

`ExampleSheet` and `PostIt` are decorative and static — no motion, no live editing surface. The
post-it's text is a plain string in `nl.ts`.

Adding an exercise type adds a card automatically: the grid maps `EXERCISE_TYPES`. Only the icon and the tint/accent pair in that file's `VISUALS` map need a new entry.

## Exercise page

`SommenPage` reads `:type` from `useParams` and narrows it against `EXERCISE_TYPES`; anything else renders `NotFoundPage` — no redirect, no 404 route match.

Layout is `grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]`: config panel left (one third), preview right (two thirds); one column below `lg`.

- Before a worksheet exists (no `s` param) the right column is a dashed-border empty state, `print:hidden`.
- `useWorksheetFromUrl(type)` is the only reader of the URL; an effect pushes its decoded `config` and `title` into the form store so the panel reflects the link that was opened. Navigation, seeds and push-vs-replace are [url-state.md](url-state.md)'s contract, not this doc's.

## Config panel

`WorksheetForm` is the shared frame for all six types: a `Card` holding the title `Input`, `<OptionsPanel>`, the field-less issue list, and the button row (`Maak oefenblad`, then `Nieuwe sommen`, `Print` and `CopyLinkButton` once a worksheet exists).

`registry.tsx` maps `ExerciseType → options component`. **Adding a type is one entry in that map** plus the component. `fields/` holds the reusable inputs — `NumberField`, `BlockCountField`, `PerBlockField`, `NumberSetField`, `RangeRadioField` — so an options component is a composition, never bespoke markup.

Validation runs on every render via `getGenerator(config.type).validate(config)`; the config vocabulary itself is [exercises/README.md](exercises/README.md)'s.

| Issue                             | Surfaces                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| carries a `field` the type claims | inline under that input, inside the options component, via `fieldError(issues, field, type)`                        |
| any other issue                   | as `text-danger` lines between the options and the button row, via `formLevelIssues(issues, inlineFieldsFor(type))` |
| any issue at all                  | the submit button is `disabled` and submit is a no-op                                                               |

`registry.tsx` declares, per type, which fields its options component renders inline. Every other issue falls through to the form-level list. Why: an issue that no component claims must still be visible, so the fallback is structural rather than a per-component obligation.

`OptionsPanel` holds the codebase's one unavoidable cast: the registry is typed per member of the `ExerciseConfig` union, but the panel receives the union. TypeScript cannot soundly narrow a union config to one component's props, so the looked-up component is cast once, at that single boundary. Do not spread the cast into the options components.

## Worksheet preview

`WorksheetPreview` renders two `SheetView`s over the same `Worksheet`: `mode="student"`, then `mode="answers"`, separated by a heavier labelled divider (`.worksheet-sheet-break`) distinct from the dotted in-sheet page break. There is no toggle — see [print.md](print.md).

| Component            | Renders                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `SheetView`           | `.worksheet-sheet`: N fixed-width A4 `.worksheet-page`s, chunked by measured pagination (see `usePaginatedBlocks`)              |
| `SheetHeader`         | the sheet's header — title left (`nl.sheet.untitled` when empty), `Naam: ______` or `Antwoordenvel` right — on the first page only |
| `usePaginatedBlocks`  | chunks a sheet's flattened blocks into pages from real measured DOM heights; owns no markup — see [print.md](print.md)          |
| `MeasurementProbe`    | renders every block once, hidden and off-screen, purely so `usePaginatedBlocks` can read real heights before painting          |
| `BlockView`           | one `.worksheet-block` bordered box; dispatches to `SplitsView` for splitsen, else `ExerciseRow`                                |
| `ExerciseRow`         | a five-column `lhs op rhs = result` row in the `worksheet` utility, right-aligned                                               |
| `TermView`            | dispatches on `Term.kind`: `int` prints the value, `frac` delegates to `FractionView`                                           |
| `FractionView`        | stacked or mixed fraction — display rules are owned by [exercises/breuken.md](exercises/breuken.md)                             |

The `block.blank` slot renders per mode: `...` on the student sheet (`aria-hidden`, since it is a writing space and not content), the term in `<strong>` on the answer sheet. Every other slot prints its term in both modes.

### Splitsen renders differently

`SplitsView` draws a splits diagram, not an equation row: the whole number (`result`) sits in a full-width cell above a horizontal rule, and below it two equal cells side by side separated by a vertical rule hold `lhs` and `rhs`. All three are centred. The blanked cell — always `rhs`, so the right-hand box — renders a non-breaking space on the student sheet and the bold number on the answer sheet. This doc owns that visual; [exercises/splitsen.md](exercises/splitsen.md) points here for it.

## Dutch copy

Every user-facing string lives in `src/i18n/nl.ts`; no component holds a literal. Wording is carried over **verbatim** from the legacy site, including the block-count labels (`Aantal 6+5=...`) and range labels (`t/m 20 zonder tientaloverschrijding`) — teachers recognise them. Do not reword them for consistency; do not copy them into this spec.

## Accessibility

- Every input is a `Label`/`htmlFor` pair with a `useId` id; grouped inputs sit in a `fieldset` with a `legend`.
- `NumberField` sets `aria-invalid` when it has an error, and prints the message next to the field.
- Focus-visible rings come from the base layer and each ui component; see [design-system.md](design-system.md).
- The header menu is keyboard-operable (Escape closes, `aria-expanded` reflects state).
