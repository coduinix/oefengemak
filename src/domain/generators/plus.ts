import { exercise, int, type Exercise } from '@/domain/core'
import { MIN_RANGE_MAX, defaultPlus, type PlusConfig } from '@/domain/config'
import { roundRobinSource, withNoRepeatWithinBlock } from '@/domain/sources'
import { noTensCrossing } from './predicates'
import {
  VARIATION_POOL,
  readVariation,
  validateVariation,
  variationLayout,
  writeVariation,
} from './variation'
import type { ExerciseGenerator } from './generator'

/** All ways to write `sum` as a + b with both addends at or above `minOperand`. */
function groupForSum(sum: number, minOperand: number, carry: 'any' | 'none'): Exercise[] {
  const group: Exercise[] = []
  for (let lhs = minOperand; lhs <= sum - minOperand; lhs++) {
    const candidate = exercise(int(lhs), '+', int(sum - lhs), int(sum))
    if (carry === 'none' && !noTensCrossing(candidate)) continue
    group.push(candidate)
  }
  return group
}

export const plusGenerator: ExerciseGenerator<PlusConfig> = {
  type: 'plus',
  defaults: defaultPlus,
  layout: (config) => variationLayout(config.layout),
  sources(config) {
    const { min, max } = config.sumRange
    const groups: Exercise[][] = []
    for (let sum = min; sum <= max; sum++) {
      groups.push(groupForSum(sum, config.minOperand, config.carry))
    }
    return {
      [VARIATION_POOL]: withNoRepeatWithinBlock(roundRobinSource(groups), config.layout.perBlock),
    }
  },
  validate: validateVariation,
  codec: {
    toParams(config, writer) {
      writer.set('min', config.sumRange.min)
      writer.set('max', config.sumRange.max)
      writer.set('carry', config.carry)
      writer.set('mo', config.minOperand)
      writeVariation(config.layout, writer)
    },
    fromParams(reader) {
      const max = reader.int('max', defaultPlus.sumRange.max, 1, MIN_RANGE_MAX)
      const min = Math.min(reader.int('min', defaultPlus.sumRange.min, 0, MIN_RANGE_MAX), max)
      return {
        config: {
          type: 'plus',
          sumRange: { min, max },
          carry: reader.oneOf('carry', defaultPlus.carry, ['any', 'none']),
          minOperand: reader.int('mo', defaultPlus.minOperand, 0, MIN_RANGE_MAX),
          layout: readVariation(reader, defaultPlus.layout),
        },
        repaired: reader.didRepair,
      }
    },
  },
}
