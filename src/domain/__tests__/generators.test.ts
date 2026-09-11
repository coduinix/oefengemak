import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import {
  EXERCISE_TYPES,
  applyOperator,
  isFrac,
  isInt,
  sameTerms,
  type Exercise,
  type ExerciseType,
} from '@/domain/core'
import { gcd } from '@/domain/core/fraction'
import { MAX_EXERCISES } from '@/domain/config'
import { getGenerator } from '@/domain/generators'
import { noTensCrossing } from '@/domain/generators/predicates'
import { planBlocks } from '@/domain/layout'
import { arbConfigByType, arbSeed } from './arbitraries'
import { exercisesOf, sectionFor } from './helpers'

const RUNS = { numRuns: 60 }

describe.each(EXERCISE_TYPES)('%s', (type: ExerciseType) => {
  const arbConfig = arbConfigByType[type]

  it('produces exercises whose stated result is correct', () => {
    fc.assert(
      fc.property(arbConfig, arbSeed, (config, seed) => {
        for (const e of exercisesOf(sectionFor(config, seed))) {
          expect(sameTerms(applyOperator(e.lhs, e.operator, e.rhs), reduced(e.result))).toBe(true)
        }
      }),
      RUNS,
    )
  })

  it('is deterministic for a given seed', () => {
    fc.assert(
      fc.property(arbConfig, arbSeed, (config, seed) => {
        expect(sectionFor(config, seed)).toEqual(sectionFor(config, seed))
      }),
      RUNS,
    )
  })

  it('fills every planned block completely', () => {
    fc.assert(
      fc.property(arbConfig, arbSeed, (config, seed) => {
        const generator = getGenerator(type)
        if (!generator.validate(config as never).ok) return
        const plans = planBlocks(generator.layout(config as never))
        const section = sectionFor(config, seed)
        expect(section.blocks).toHaveLength(plans.length)
        section.blocks.forEach((block, i) => {
          expect(block.exercises).toHaveLength(plans[i]?.size ?? -1)
          expect(block.blank).toBe(plans[i]?.blank)
        })
      }),
      RUNS,
    )
  })

  it('refuses to generate more than the exercise cap', () => {
    const generator = getGenerator(type)
    fc.assert(
      fc.property(arbConfig, arbSeed, (config, seed) => {
        if (!generator.validate(config as never).ok) return
        expect(exercisesOf(sectionFor(config, seed)).length).toBeLessThanOrEqual(MAX_EXERCISES)
      }),
      RUNS,
    )
  })

  it('matches its golden snapshot at a fixed seed', () => {
    expect(sectionFor(getGenerator(type).defaults, 20260911)).toMatchSnapshot()
  })
})

describe('plus', () => {
  it('keeps every sum inside the configured range', () => {
    fc.assert(
      fc.property(arbConfigByType.plus, arbSeed, (config, seed) => {
        if (config.type !== 'plus') return
        for (const e of exercisesOf(sectionFor(config, seed))) {
          expect(intOf(e.result)).toBeGreaterThanOrEqual(config.sumRange.min)
          expect(intOf(e.result)).toBeLessThanOrEqual(config.sumRange.max)
          expect(intOf(e.lhs)).toBeGreaterThanOrEqual(config.minOperand)
          expect(intOf(e.rhs)).toBeGreaterThanOrEqual(config.minOperand)
        }
      }),
      RUNS,
    )
  })

  it('never carries into the tens when carry is none', () => {
    fc.assert(
      fc.property(arbConfigByType.plus, arbSeed, (config, seed) => {
        if (config.type !== 'plus') return
        const noCarry = { ...config, carry: 'none' as const }
        for (const e of exercisesOf(sectionFor(noCarry, seed))) {
          expect(noTensCrossing(e)).toBe(true)
          expect((intOf(e.lhs) % 10) + (intOf(e.rhs) % 10)).toBeLessThanOrEqual(10)
        }
      }),
      RUNS,
    )
  })

  it('includes a low first addend that the legacy minOperand bound excluded', () => {
    const config = {
      type: 'plus' as const,
      sumRange: { min: 10, max: 20 },
      carry: 'none' as const,
      minOperand: 0,
      layout: { perBlock: 5, counts: { result: 8, lhs: 0, rhs: 0 } },
    }
    const drawn = exercisesOf(sectionFor(config, 7))
    expect(drawn.some((e) => intOf(e.lhs) < 10)).toBe(true)
  })
})

describe('min', () => {
  it('never produces a negative or zero remainder', () => {
    fc.assert(
      fc.property(arbConfigByType.min, arbSeed, (config, seed) => {
        if (config.type !== 'min') return
        for (const e of exercisesOf(sectionFor(config, seed))) {
          expect(intOf(e.result)).toBe(intOf(e.lhs) - intOf(e.rhs))
          expect(intOf(e.result)).toBeGreaterThanOrEqual(1)
          expect(intOf(e.rhs)).toBeGreaterThanOrEqual(0)
          expect(intOf(e.lhs)).toBeLessThanOrEqual(config.max)
        }
      }),
      RUNS,
    )
  })
})

describe('tafels', () => {
  it('multiplies a 1..10 multiplicand by a selected table', () => {
    fc.assert(
      fc.property(arbConfigByType.tafels, arbSeed, (config, seed) => {
        if (config.type !== 'tafels') return
        for (const e of exercisesOf(sectionFor(config, seed))) {
          expect(intOf(e.lhs)).toBeGreaterThanOrEqual(1)
          expect(intOf(e.lhs)).toBeLessThanOrEqual(10)
          expect(config.tables).toContain(intOf(e.rhs))
          expect(intOf(e.result)).toBe(intOf(e.lhs) * intOf(e.rhs))
        }
      }),
      RUNS,
    )
  })

  it('handles the zero table without crashing', () => {
    const config = {
      type: 'tafels' as const,
      tables: [0],
      layout: { perBlock: 5, counts: { result: 2, lhs: 0, rhs: 0 } },
    }
    const drawn = exercisesOf(sectionFor(config, 1))
    expect(drawn).toHaveLength(10)
    expect(drawn.every((e) => intOf(e.result) === 0)).toBe(true)
  })
})

describe('delen', () => {
  it('divides exactly and never by zero', () => {
    fc.assert(
      fc.property(arbConfigByType.delen, arbSeed, (config, seed) => {
        if (config.type !== 'delen') return
        for (const e of exercisesOf(sectionFor(config, seed))) {
          expect(intOf(e.rhs)).not.toBe(0)
          expect(intOf(e.lhs) % intOf(e.rhs)).toBe(0)
          expect(intOf(e.result)).toBeGreaterThanOrEqual(1)
          expect(intOf(e.result)).toBeLessThanOrEqual(10)
        }
      }),
      RUNS,
    )
  })
})

describe('splitsen', () => {
  it('splits a selected number into two parts', () => {
    fc.assert(
      fc.property(arbConfigByType.splitsen, arbSeed, (config, seed) => {
        if (config.type !== 'splitsen') return
        const section = sectionFor(config, seed)
        expect(section.blocks.every((b) => b.blank === 'rhs')).toBe(true)
        for (const e of exercisesOf(section)) {
          expect(config.numbers).toContain(intOf(e.result))
          expect(intOf(e.lhs) + intOf(e.rhs)).toBe(intOf(e.result))
          expect(intOf(e.lhs)).toBeGreaterThanOrEqual(0)
          expect(intOf(e.lhs)).toBeLessThan(intOf(e.result))
        }
      }),
      RUNS,
    )
  })
})

describe('breuken', () => {
  it('uses proper operands and a reduced, non-negative result', () => {
    fc.assert(
      fc.property(arbConfigByType.breuken, arbSeed, (config, seed) => {
        if (config.type !== 'breuken') return
        for (const e of exercisesOf(sectionFor(config, seed))) {
          for (const operand of [e.lhs, e.rhs]) {
            expect(isFrac(operand)).toBe(true)
            if (!isFrac(operand)) return
            expect(operand.d).toBeGreaterThanOrEqual(2)
            expect(operand.d).toBeLessThanOrEqual(config.maxDenominator)
            expect(operand.n).toBeGreaterThan(0)
            expect(operand.n).toBeLessThan(operand.d)
          }
          expect(isFrac(e.result)).toBe(true)
          if (!isFrac(e.result)) return
          expect(e.result.n).toBeGreaterThanOrEqual(0)
          expect(e.result.d).toBeGreaterThan(0)
          expect(gcd(e.result.n, e.result.d)).toBe(e.result.n === 0 ? e.result.d : 1)
        }
      }),
      RUNS,
    )
  })

  it('keeps each block to a single operator, in the order + - × :', () => {
    const config = {
      type: 'breuken' as const,
      maxDenominator: 10 as const,
      perBlock: 5,
      counts: { add: 1, sub: 1, mul: 1, div: 1 },
    }
    const section = sectionFor(config, 4)
    expect(section.blocks.map((b) => new Set(b.exercises.map((e) => e.operator)).size)).toEqual([
      1, 1, 1, 1,
    ])
    expect(section.blocks.map((b) => b.exercises[0]?.operator)).toEqual(['+', '-', '×', ':'])
  })

  it('survives a subtraction-only sheet, where roughly half the samples are rejected', () => {
    const config = {
      type: 'breuken' as const,
      maxDenominator: 100 as const,
      perBlock: 5,
      counts: { add: 0, sub: 8, mul: 0, div: 0 },
    }
    for (let seed = 0; seed < 25; seed++) {
      expect(exercisesOf(sectionFor(config, seed))).toHaveLength(40)
    }
  })
})

function intOf(term: Exercise['lhs']): number {
  if (!isInt(term)) throw new Error('expected an integer term')
  return term.value
}

function reduced(term: Exercise['result']) {
  if (!isFrac(term)) return term
  const divisor = gcd(term.n, term.d) || 1
  return { kind: 'frac' as const, n: term.n / divisor, d: term.d / divisor }
}
