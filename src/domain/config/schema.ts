import { z } from 'zod'
import {
  BREUKEN_DENOMINATORS,
  MAX_BLOCKS,
  MAX_PER_BLOCK,
  MAX_TITLE_LENGTH,
  MIN_RANGE_MAX,
} from './limits'

const blockCount = z.number().int().min(0).max(MAX_BLOCKS)
const perBlock = z.number().int().min(1).max(MAX_PER_BLOCK)
const numberSet = z.array(z.number().int().min(0)).readonly()

export const variationLayoutSchema = z.object({
  perBlock,
  counts: z.object({ result: blockCount, lhs: blockCount, rhs: blockCount }),
})

export const plusConfigSchema = z.object({
  type: z.literal('plus'),
  sumRange: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0).max(MIN_RANGE_MAX),
  }),
  carry: z.enum(['any', 'none']),
  minOperand: z.number().int().min(0),
  layout: variationLayoutSchema,
})

export const minConfigSchema = z.object({
  type: z.literal('min'),
  max: z.number().int().min(1).max(MIN_RANGE_MAX),
  layout: variationLayoutSchema,
})

export const tafelsConfigSchema = z.object({
  type: z.literal('tafels'),
  tables: numberSet,
  layout: variationLayoutSchema,
})

export const delenConfigSchema = z.object({
  type: z.literal('delen'),
  divisors: numberSet,
  layout: variationLayoutSchema,
})

export const splitsenConfigSchema = z.object({
  type: z.literal('splitsen'),
  numbers: numberSet,
  count: z
    .number()
    .int()
    .min(0)
    .max(MAX_BLOCKS * MAX_PER_BLOCK),
  perBlock,
})

export const breukenConfigSchema = z.object({
  type: z.literal('breuken'),
  maxDenominator: z.union([z.literal(10), z.literal(50), z.literal(100)]),
  perBlock,
  counts: z.object({ add: blockCount, sub: blockCount, mul: blockCount, div: blockCount }),
})

export const exerciseConfigSchema = z.discriminatedUnion('type', [
  splitsenConfigSchema,
  plusConfigSchema,
  minConfigSchema,
  tafelsConfigSchema,
  delenConfigSchema,
  breukenConfigSchema,
])

export type VariationLayout = z.infer<typeof variationLayoutSchema>
export type PlusConfig = z.infer<typeof plusConfigSchema>
export type MinConfig = z.infer<typeof minConfigSchema>
export type TafelsConfig = z.infer<typeof tafelsConfigSchema>
export type DelenConfig = z.infer<typeof delenConfigSchema>
export type SplitsenConfig = z.infer<typeof splitsenConfigSchema>
export type BreukenConfig = z.infer<typeof breukenConfigSchema>
export type ExerciseConfig = z.infer<typeof exerciseConfigSchema>

export const titleSchema = z.string().max(MAX_TITLE_LENGTH)

export const BREUKEN_DENOMINATOR_VALUES: readonly number[] = BREUKEN_DENOMINATORS
