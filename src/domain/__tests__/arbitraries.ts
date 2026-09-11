import fc from 'fast-check'
import type { ExerciseConfig } from '@/domain/config'
import {
  BREUKEN_DENOMINATORS,
  DELEN_DIVISORS,
  SPLITSEN_NUMBERS,
  TAFELS_NUMBERS,
} from '@/domain/config'
import { MAX_SEED } from '@/domain/rng'

export const arbSeed = fc.integer({ min: 0, max: MAX_SEED })

const arbBlockCount = fc.integer({ min: 0, max: 6 })
const arbPerBlock = fc.integer({ min: 1, max: 8 })

const arbVariationLayout = fc.record({
  perBlock: arbPerBlock,
  counts: fc.record({ result: arbBlockCount, lhs: arbBlockCount, rhs: arbBlockCount }),
})

const arbSubsetOf = (values: readonly number[]) =>
  fc.subarray([...values], { minLength: 1 }).map((a) => a as readonly number[])

export const arbPlus = fc
  .record({
    max: fc.integer({ min: 1, max: 100 }),
    carry: fc.constantFrom('any' as const, 'none' as const),
    layout: arbVariationLayout,
  })
  .map(({ max, carry, layout }): ExerciseConfig => ({
    type: 'plus',
    sumRange: { min: 0, max },
    carry,
    minOperand: 0,
    layout,
  }))

export const arbMin = fc
  .record({ max: fc.integer({ min: 1, max: 100 }), layout: arbVariationLayout })
  .map(({ max, layout }): ExerciseConfig => ({ type: 'min', max, layout }))

export const arbTafels = fc
  .record({ tables: arbSubsetOf(TAFELS_NUMBERS), layout: arbVariationLayout })
  .map(({ tables, layout }): ExerciseConfig => ({ type: 'tafels', tables, layout }))

export const arbDelen = fc
  .record({ divisors: arbSubsetOf(DELEN_DIVISORS), layout: arbVariationLayout })
  .map(({ divisors, layout }): ExerciseConfig => ({ type: 'delen', divisors, layout }))

export const arbSplitsen = fc
  .record({
    numbers: arbSubsetOf(SPLITSEN_NUMBERS),
    count: fc.integer({ min: 1, max: 60 }),
    perBlock: arbPerBlock,
  })
  .map(({ numbers, count, perBlock }): ExerciseConfig => ({
    type: 'splitsen',
    numbers,
    count,
    perBlock,
  }))

export const arbBreuken = fc
  .record({
    maxDenominator: fc.constantFrom(...BREUKEN_DENOMINATORS),
    perBlock: arbPerBlock,
    counts: fc.record({
      add: arbBlockCount,
      sub: arbBlockCount,
      mul: arbBlockCount,
      div: arbBlockCount,
    }),
  })
  .map(({ maxDenominator, perBlock, counts }): ExerciseConfig => ({
    type: 'breuken',
    maxDenominator,
    perBlock,
    counts,
  }))

export const arbConfig = fc.oneof(arbPlus, arbMin, arbTafels, arbDelen, arbSplitsen, arbBreuken)

export const arbConfigByType = {
  plus: arbPlus,
  min: arbMin,
  tafels: arbTafels,
  delen: arbDelen,
  splitsen: arbSplitsen,
  breuken: arbBreuken,
} as const
