Status: CONTRACT
Owns: the worksheet URL contract and the URL↔store direction
Read with: [domain.md](domain.md), [decisions/0001-url-encoded-state.md](decisions/0001-url-encoded-state.md)
Code: src/domain/url/**, src/stores/worksheet-form-store.ts, src/features/worksheet-form/**

# URL state

## Decision

A worksheet URL carries **readable query params: the config plus a uint32 seed**. Exercises are regenerated from the seed and **never serialized**.

- Size: ~110 chars instead of ~4 KB of serialized sums.
- One source of truth: config and exercises cannot contradict each other, because there is only the config.
- It forces generation to be pure and seeded — which is exactly what the property tests need.

Accepted cost, stated plainly: **we guarantee config stability, not exercise stability.** Changing a generator makes an old link render different sums. `v` is the escape hatch.

## Shared params

| Param | Meaning        | Notes                                                                                |
| ----- | -------------- | ------------------------------------------------------------------------------------ |
| `v`   | schema version | absent ⇒ 1; bumped only on incompatible meaning changes — additive params never bump |
| `s`   | seed           | uint32, base36; absent ⇒ no worksheet yet, show the empty form                       |
| `t`   | title          | capped at 80 chars                                                                   |

Exercise type comes from the route, not a param.

## Per-type params

| Type                            | Params                                                   |
| ------------------------------- | -------------------------------------------------------- |
| shared by plus/min/tafels/delen | `pb` (perBlock), `res` / `lhs` / `rhs` (block counts)    |
| plus                            | `min`, `max`, `carry` (`any`\|`none`), `mo` (minOperand) |
| min                             | `max`                                                    |
| tafels                          | `tab`                                                    |
| delen                           | `div`                                                    |
| splitsen                        | `n`, `count`, `pb`                                       |
| breuken                         | `den` (10\|50\|100), `pb`, `add`, `sub`, `mul`, `div`    |

Number sets use readable range-collapsed lists: `tab=1-10,12`. A bitmask was rejected as unreadable.

## Robustness

- `decode` is **total**: arbitrary garbage yields defaults plus one non-blocking toast, never a throw.
- Unknown params are ignored.
- `buildWorksheetUrl` asserts the result is < 2000 chars, dropping the title first.

## Examples

```
/sommen/plus?v=1&s=8kq2m1&t=Rekenen+week+12&min=0&max=20&carry=none&mo=0&pb=5&res=4&lhs=4&rhs=0
/sommen/breuken?v=1&s=zq47b&t=Breuken+groep+7&den=50&pb=5&add=4&sub=4&mul=2&div=2
```

## Codec

`ConfigCodec<C>` takes an optional `prefix`, `''` in v1. Why: phase-2 multi-sheet becomes an addition, not a rewrite.

Phase-2 sketch: `?n=2&s1.type=plus&s1.max=20&s2.type=tafels&s2.tab=1-10`.
`n` gives the sheet count; each sheet's params are read with `prefix = 's<i>.'` by the same codecs.
Only the top-level reader changes; per-type codecs stay untouched.

## Direction

**URL is the source of truth for the rendered worksheet. Zustand is the form's editing buffer.**

```
form → store → "Maak oefenblad" → navigate(buildWorksheetUrl(config, newSeed))
     → route reads useSearchParams() → useMemo(() => generateWorksheet(decode(params)))
```

| Action                       | Navigation                                                     |
| ---------------------------- | -------------------------------------------------------------- |
| "Maak oefenblad"             | push, new seed                                                 |
| "Nieuwe sommen"              | push, same config, fresh seed — Back walks previous worksheets |
| Form tweak before generating | `replace: true`                                                |

Generation happens only on URL change, never on keystroke.

One hook, `useWorksheetFromUrl()`, is the only place the URL and the domain meet. Nothing else parses search params.

## Versioning

`domain/url/versions.ts` exposes `migrate(params: URLSearchParams): URLSearchParams`, which reads `v` itself and applies each registered migration in order. It runs before parsing, so the codecs only ever see the current shape.
