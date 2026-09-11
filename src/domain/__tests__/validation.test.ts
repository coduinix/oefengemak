import { describe, expect, it } from 'vitest'
import { MAX_EXERCISES } from '@/domain/config'
import { getGenerator } from '@/domain/generators'
import { exercisesOf, sectionFor } from './helpers'

const emptyLayout = { perBlock: 5, counts: { result: 0, lhs: 0, rhs: 0 } }
const bigLayout = { perBlock: 20, counts: { result: 40, lhs: 0, rhs: 0 } }

describe('empty selections are rejected, not crashed on', () => {
  it('tafels with no table selected', () => {
    const config = {
      type: 'tafels' as const,
      tables: [],
      layout: getGenerator('tafels').defaults.layout,
    }
    const result = getGenerator('tafels').validate(config)
    expect(result.ok).toBe(false)
    expect(result.ok ? [] : result.issues.map((i) => i.code)).toContain('EMPTY_SELECTION')
    expect(exercisesOf(sectionFor(config, 1))).toEqual([])
  })

  it('splitsen with no number selected', () => {
    const config = { type: 'splitsen' as const, numbers: [], count: 20, perBlock: 5 }
    expect(getGenerator('splitsen').validate(config).ok).toBe(false)
    expect(exercisesOf(sectionFor(config, 1))).toEqual([])
  })

  it('delen with no divisor selected', () => {
    const config = {
      type: 'delen' as const,
      divisors: [],
      layout: getGenerator('delen').defaults.layout,
    }
    expect(getGenerator('delen').validate(config).ok).toBe(false)
  })
})

describe('degenerate counts', () => {
  it('reports an empty worksheet when every block count is zero', () => {
    const config = {
      type: 'plus' as const,
      sumRange: { min: 0, max: 10 },
      carry: 'any' as const,
      minOperand: 0,
      layout: emptyLayout,
    }
    const result = getGenerator('plus').validate(config)
    expect(result.ok ? [] : result.issues.map((i) => i.code)).toEqual(['NO_EXERCISES'])
    expect(exercisesOf(sectionFor(config, 1))).toEqual([])
  })

  it('reports an empty breuken worksheet when every operator count is zero', () => {
    const config = {
      type: 'breuken' as const,
      maxDenominator: 10 as const,
      perBlock: 5,
      counts: { add: 0, sub: 0, mul: 0, div: 0 },
    }
    expect(getGenerator('breuken').validate(config).ok).toBe(false)
  })
})

describe('a hand-edited URL cannot hang the tab', () => {
  it('rejects a configuration above the exercise cap', () => {
    const config = {
      type: 'plus' as const,
      sumRange: { min: 0, max: 10 },
      carry: 'any' as const,
      minOperand: 0,
      layout: bigLayout,
    }
    expect(bigLayout.perBlock * bigLayout.counts.result).toBeGreaterThan(MAX_EXERCISES)
    const result = getGenerator('plus').validate(config)
    expect(result.ok ? [] : result.issues.map((i) => i.code)).toEqual(['TOO_MANY_EXERCISES'])
    expect(exercisesOf(sectionFor(config, 1))).toEqual([])
  })
})

describe('splitsen rounds its count up to whole blocks', () => {
  it('caps on the rounded-up total, not the requested count', () => {
    const generator = getGenerator('splitsen')
    // 500 at 19 per block rounds up to 27 blocks of 19 = 513 exercises.
    expect(
      generator.validate({ type: 'splitsen', numbers: [10], count: 500, perBlock: 19 }).ok,
    ).toBe(false)
    expect(
      generator.validate({ type: 'splitsen', numbers: [10], count: 500, perBlock: 20 }).ok,
    ).toBe(true)
  })

  it('fills whole blocks, so 22 exercises at 5 per block becomes 25', () => {
    const config = { type: 'splitsen' as const, numbers: [10], count: 22, perBlock: 5 }
    expect(exercisesOf(sectionFor(config, 1))).toHaveLength(25)
  })
})
