import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { MAX_SEED, createRng, deriveRng, seedFromString, seedToString } from './rng'

const arbSeed = fc.integer({ min: 0, max: MAX_SEED })

describe('createRng', () => {
  it('is deterministic for a given seed', () => {
    fc.assert(
      fc.property(arbSeed, (seed) => {
        const a = Array.from({ length: 20 }, () => createRng(seed).nextFloat())
        const b = Array.from({ length: 20 }, () => createRng(seed).nextFloat())
        expect(a).toEqual(b)
      }),
    )
  })

  it('produces floats in [0, 1)', () => {
    const rng = createRng(1234)
    for (let i = 0; i < 1000; i++) {
      const v = rng.nextFloat()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('int', () => {
  it('is inclusive at both ends and never out of range', () => {
    fc.assert(
      fc.property(
        arbSeed,
        fc.integer({ min: -50, max: 50 }),
        fc.nat({ max: 20 }),
        (seed, min, span) => {
          const rng = createRng(seed)
          const max = min + span
          for (let i = 0; i < 50; i++) {
            const v = rng.int(min, max)
            expect(v).toBeGreaterThanOrEqual(min)
            expect(v).toBeLessThanOrEqual(max)
          }
        },
      ),
    )
  })

  it('returns the single value when min === max', () => {
    expect(createRng(7).int(4, 4)).toBe(4)
  })

  it('reaches both bounds', () => {
    const rng = createRng(99)
    const seen = new Set(Array.from({ length: 500 }, () => rng.int(0, 3)))
    expect([...seen].sort()).toEqual([0, 1, 2, 3])
  })

  it('rejects an empty range', () => {
    expect(() => createRng(1).int(5, 4)).toThrow(RangeError)
  })
})

describe('shuffle', () => {
  it('returns a permutation without mutating its input', () => {
    fc.assert(
      fc.property(arbSeed, fc.array(fc.integer(), { maxLength: 30 }), (seed, items) => {
        const original = [...items]
        const out = createRng(seed).shuffle(items)
        expect(items).toEqual(original)
        expect([...out].sort((a, b) => a - b)).toEqual([...items].sort((a, b) => a - b))
      }),
    )
  })

  it('moves every element to every position over many seeds', () => {
    const positions = new Map<string, Set<number>>()
    for (let seed = 0; seed < 300; seed++) {
      createRng(seed)
        .shuffle(['a', 'b', 'c', 'd'])
        .forEach((item, index) => {
          const seen = positions.get(item) ?? new Set<number>()
          seen.add(index)
          positions.set(item, seen)
        })
    }
    for (const seen of positions.values()) expect(seen.size).toBe(4)
  })
})

describe('deriveRng', () => {
  it('gives different labels independent streams', () => {
    const a = deriveRng(42, '0:plus').nextFloat()
    const b = deriveRng(42, '1:plus').nextFloat()
    expect(a).not.toBe(b)
  })

  it('is stable for the same seed and label', () => {
    expect(deriveRng(42, '0:plus').nextFloat()).toBe(deriveRng(42, '0:plus').nextFloat())
  })
})

describe('seed encoding', () => {
  it('round-trips and stays within seven characters', () => {
    fc.assert(
      fc.property(arbSeed, (seed) => {
        const encoded = seedToString(seed)
        expect(encoded.length).toBeLessThanOrEqual(7)
        expect(seedFromString(encoded)).toBe(seed)
      }),
    )
  })

  it('rejects malformed seeds', () => {
    for (const bad of ['', 'ZZZ', '-1', '1.5', 'zzzzzzzz', 'abc def']) {
      expect(seedFromString(bad)).toBeNull()
    }
  })
})
