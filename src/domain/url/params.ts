/**
 * Lenient readers: a worksheet link may be hand-edited, so every reader falls back to a default
 * rather than failing. See specs/url-state.md.
 */
export class ParamReader {
  private readonly params: URLSearchParams
  private readonly prefix: string
  private repaired = false

  constructor(params: URLSearchParams, prefix = '') {
    this.params = params
    this.prefix = prefix
  }

  get didRepair(): boolean {
    return this.repaired
  }

  raw(key: string): string | null {
    return this.params.get(this.prefix + key)
  }

  int(key: string, fallback: number, min: number, max: number): number {
    const raw = this.raw(key)
    if (raw === null) return fallback
    const parsed = Number(raw)
    if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
      this.repaired = true
      return fallback
    }
    return parsed
  }

  oneOf<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
    const raw = this.raw(key)
    if (raw === null) return fallback
    if (!(allowed as readonly string[]).includes(raw)) {
      this.repaired = true
      return fallback
    }
    return raw as T
  }

  oneOfNumber<T extends number>(key: string, fallback: T, allowed: readonly T[]): T {
    const raw = this.raw(key)
    if (raw === null) return fallback
    const parsed = Number(raw)
    const match = allowed.find((value) => value === parsed)
    if (match === undefined) {
      this.repaired = true
      return fallback
    }
    return match
  }

  numberSet(
    key: string,
    fallback: readonly number[],
    allowed: readonly number[],
  ): readonly number[] {
    const raw = this.raw(key)
    if (raw === null) return fallback
    const parsed = parseNumberList(raw).filter((n) => allowed.includes(n))
    if (parsed.length !== parseNumberList(raw).length) this.repaired = true
    return parsed
  }

  text(key: string, maxLength: number): string {
    const raw = this.raw(key)
    if (raw === null) return ''
    if (raw.length > maxLength) {
      this.repaired = true
      return raw.slice(0, maxLength)
    }
    return raw
  }
}

export class ParamWriter {
  constructor(
    private readonly params: URLSearchParams,
    private readonly prefix = '',
  ) {}

  set(key: string, value: string | number): void {
    this.params.set(this.prefix + key, String(value))
  }

  setNumberSet(key: string, values: readonly number[]): void {
    this.params.set(this.prefix + key, formatNumberList(values))
  }
}

/** Accepts "1-10,12"; ignores anything malformed rather than throwing. */
export function parseNumberList(raw: string): number[] {
  if (raw.trim() === '') return []
  const out = new Set<number>()
  for (const part of raw.split(',')) {
    const rangeMatch = /^(\d+)-(\d+)$/.exec(part.trim())
    if (rangeMatch) {
      const from = Number(rangeMatch[1])
      const to = Number(rangeMatch[2])
      if (from <= to && to - from <= 1000) {
        for (let n = from; n <= to; n++) out.add(n)
      }
      continue
    }
    const single = /^\d+$/.exec(part.trim())
    if (single) out.add(Number(single[0]))
  }
  return [...out].sort((a, b) => a - b)
}

/** Collapses runs of three or more into "from-to" so links stay readable. */
export function formatNumberList(values: readonly number[]): string {
  const sorted = [...new Set(values)].sort((a, b) => a - b)
  const parts: string[] = []
  let i = 0
  while (i < sorted.length) {
    let j = i
    while (j + 1 < sorted.length && (sorted[j + 1] as number) === (sorted[j] as number) + 1) j++
    const from = sorted[i] as number
    const to = sorted[j] as number
    parts.push(j - i >= 2 ? `${from}-${to}` : sorted.slice(i, j + 1).join(','))
    i = j + 1
  }
  return parts.join(',')
}
