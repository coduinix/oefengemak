import type {
  BreukenConfig,
  DelenConfig,
  ExerciseConfig,
  MinConfig,
  PlusConfig,
  SplitsenConfig,
  TafelsConfig,
  VariationLayout,
} from './schema'
import { DELEN_DIVISORS, range } from './limits'
import type { ExerciseType } from '@/domain/core'

export const defaultVariationLayout: VariationLayout = {
  perBlock: 5,
  counts: { result: 4, lhs: 4, rhs: 0 },
}

export const defaultSplitsen: SplitsenConfig = {
  type: 'splitsen',
  numbers: range(5, 10),
  count: 20,
  perBlock: 5,
}

export const defaultPlus: PlusConfig = {
  type: 'plus',
  sumRange: { min: 0, max: 10 },
  carry: 'any',
  minOperand: 0,
  layout: defaultVariationLayout,
}

export const defaultMin: MinConfig = { type: 'min', max: 10, layout: defaultVariationLayout }

export const defaultTafels: TafelsConfig = {
  type: 'tafels',
  tables: range(1, 10),
  layout: defaultVariationLayout,
}

export const defaultDelen: DelenConfig = {
  type: 'delen',
  divisors: DELEN_DIVISORS,
  layout: defaultVariationLayout,
}

export const defaultBreuken: BreukenConfig = {
  type: 'breuken',
  maxDenominator: 10,
  perBlock: 5,
  counts: { add: 4, sub: 4, mul: 4, div: 4 },
}

export const defaultConfigs: Readonly<Record<ExerciseType, ExerciseConfig>> = {
  splitsen: defaultSplitsen,
  plus: defaultPlus,
  min: defaultMin,
  tafels: defaultTafels,
  delen: defaultDelen,
  breuken: defaultBreuken,
}
