import { exercise, int, type Exercise } from '@/domain/core'
import { MIN_RANGE_MAX, defaultMin, type MinConfig } from '@/domain/config'
import { roundRobinSource, withNoRepeatWithinBlock } from '@/domain/sources'
import {
  VARIATION_POOL,
  readVariation,
  validateVariation,
  variationLayout,
  writeVariation,
} from './variation'
import type { ExerciseGenerator } from './generator'

/** Every subtraction from `minuend` with a positive remainder. */
function groupForMinuend(minuend: number): Exercise[] {
  const group: Exercise[] = []
  for (let subtrahend = 0; subtrahend < minuend; subtrahend++) {
    group.push(exercise(int(minuend), '-', int(subtrahend), int(minuend - subtrahend)))
  }
  return group
}

export const minGenerator: ExerciseGenerator<MinConfig> = {
  type: 'min',
  defaults: defaultMin,
  layout: (config) => variationLayout(config.layout),
  sources(config) {
    const groups: Exercise[][] = []
    for (let minuend = 1; minuend <= config.max; minuend++) groups.push(groupForMinuend(minuend))
    return {
      [VARIATION_POOL]: withNoRepeatWithinBlock(roundRobinSource(groups), config.layout.perBlock),
    }
  },
  validate: validateVariation,
  codec: {
    toParams(config, writer) {
      writer.set('max', config.max)
      writeVariation(config.layout, writer)
    },
    fromParams(reader) {
      return {
        config: {
          type: 'min',
          max: reader.int('max', defaultMin.max, 1, MIN_RANGE_MAX),
          layout: readVariation(reader, defaultMin.layout),
        },
        repaired: reader.didRepair,
      }
    },
  },
}
