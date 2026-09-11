import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { GenerationError, exercise, int, isInt, type Exercise } from '@/domain/core'
import { createRng } from '@/domain/rng'
import { roundRobinSource } from './round-robin-source'
import { rejectionSource } from './rejection-source'
import { withNoRepeatWithinBlock } from './decorators'

const group = (label: number, size: number): Exercise[] =>
  Array.from({ length: size }, (_, i) => exercise(int(label), '+', int(i), int(label + i)))

const groupOf = (e: Exercise) => (isInt(e.lhs) ? e.lhs.value : -1)

describe('roundRobinSource', () => {
  it('draws from every group within one of each other', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        fc.array(fc.integer({ min: 1, max: 12 }), { minLength: 1, maxLength: 8 }),
        fc.integer({ min: 0, max: 60 }),
        (seed, sizes, count) => {
          const groups = sizes.map((size, i) => group(i, size))
          const drawn = roundRobinSource(groups).draw(count, createRng(seed))
          expect(drawn).toHaveLength(count)

          const perGroup = sizes.map((_, i) => drawn.filter((e) => groupOf(e) === i).length)
          expect(Math.max(...perGroup) - Math.min(...perGroup)).toBeLessThanOrEqual(1)
        },
      ),
    )
  })

  it('emits a full permutation of a group before repeating', () => {
    const only = group(0, 6)
    const drawn = roundRobinSource([only]).draw(12, createRng(3))
    const first = drawn.slice(0, 6).map((e) => (isInt(e.rhs) ? e.rhs.value : -1))
    const second = drawn.slice(6).map((e) => (isInt(e.rhs) ? e.rhs.value : -1))
    expect([...first].sort()).toEqual([0, 1, 2, 3, 4, 5])
    expect([...second].sort()).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('yields nothing rather than crashing on an empty selection', () => {
    expect(roundRobinSource([]).draw(10, createRng(1))).toEqual([])
    expect(roundRobinSource([[], []]).draw(10, createRng(1))).toEqual([])
  })

  it('returns nothing for a non-positive count', () => {
    expect(roundRobinSource([group(0, 3)]).draw(0, createRng(1))).toEqual([])
  })
})

describe('rejectionSource', () => {
  it('keeps sampling until the predicate is satisfied', () => {
    const source = rejectionSource((rng) => {
      const v = rng.int(0, 9)
      return v < 2 ? exercise(int(v), '+', int(1), int(v + 1)) : null
    })
    expect(source.draw(10, createRng(5))).toHaveLength(10)
  })

  it('gives up instead of hanging when nothing is acceptable', () => {
    expect(() => rejectionSource(() => null, 5).draw(3, createRng(1))).toThrow(GenerationError)
  })
})

describe('withNoRepeatWithinBlock', () => {
  it('avoids duplicates inside a block when the pool allows it', () => {
    const source = withNoRepeatWithinBlock(roundRobinSource([group(0, 20)]), 5)
    const drawn = source.draw(20, createRng(11))
    for (let start = 0; start < 20; start += 5) {
      const block = drawn.slice(start, start + 5).map((e) => (isInt(e.rhs) ? e.rhs.value : -1))
      expect(new Set(block).size).toBe(5)
    }
  })

  it('still fills the sheet when the pool is smaller than a block', () => {
    const source = withNoRepeatWithinBlock(roundRobinSource([group(0, 2)]), 5)
    expect(source.draw(10, createRng(2))).toHaveLength(10)
  })
})
