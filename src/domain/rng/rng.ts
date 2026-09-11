import { mulberry32 } from './mulberry32'
import { hashString, mix } from './hash'

export type Seed = number

export interface Rng {
  nextFloat(): number
  int(minIncl: number, maxIncl: number): number
  shuffle<T>(items: readonly T[]): T[]
}

export function createRng(seed: Seed): Rng {
  const next = mulberry32(seed)
  return {
    nextFloat: next,
    int(minIncl, maxIncl) {
      if (maxIncl < minIncl) throw new RangeError(`Empty range [${minIncl}, ${maxIncl}]`)
      return minIncl + Math.floor(next() * (maxIncl - minIncl + 1))
    },
    shuffle(items) {
      const out = [...items]
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        ;[out[i], out[j]] = [out[j] as (typeof out)[number], out[i] as (typeof out)[number]]
      }
      return out
    },
  }
}

/**
 * A per-label stream so one section can be re-rolled without disturbing its siblings.
 * See specs/domain.md.
 */
export function deriveRng(seed: Seed, label: string): Rng {
  return createRng(mix(seed >>> 0, hashString(label)))
}

export const MAX_SEED = 0xffffffff

export function seedToString(seed: Seed): string {
  return (seed >>> 0).toString(36)
}

export function seedFromString(value: string): Seed | null {
  if (!/^[0-9a-z]{1,7}$/.test(value)) return null
  const parsed = Number.parseInt(value, 36)
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= MAX_SEED ? parsed >>> 0 : null
}
