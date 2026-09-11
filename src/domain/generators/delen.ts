import { err, exercise, int, issue, type Exercise, type Result } from '@/domain/core'
import { DELEN_DIVISORS, defaultDelen, type DelenConfig } from '@/domain/config'
import { roundRobinSource, withNoRepeatWithinBlock } from '@/domain/sources'
import {
  VARIATION_POOL,
  readVariation,
  validateVariation,
  variationLayout,
  writeVariation,
} from './variation'
import type { ExerciseGenerator } from './generator'

const QUOTIENTS = 10

/** Only exact divisions: the dividend is always the divisor times the quotient. */
function groupForDivisor(divisor: number): Exercise[] {
  return Array.from({ length: QUOTIENTS }, (_, i) =>
    exercise(int(divisor * (i + 1)), ':', int(divisor), int(i + 1)),
  )
}

export const delenGenerator: ExerciseGenerator<DelenConfig> = {
  type: 'delen',
  defaults: defaultDelen,
  layout: (config) => variationLayout(config.layout),
  sources(config) {
    const groups = config.divisors.filter((d) => d > 0).map(groupForDivisor)
    return {
      [VARIATION_POOL]: withNoRepeatWithinBlock(roundRobinSource(groups), config.layout.perBlock),
    }
  },
  validate(config): Result<DelenConfig> {
    if (config.divisors.filter((d) => d > 0).length === 0) {
      return err([issue('EMPTY_SELECTION', 'divisors')])
    }
    return validateVariation(config)
  },
  codec: {
    toParams(config, writer) {
      writer.setNumberSet('div', config.divisors)
      writeVariation(config.layout, writer)
    },
    fromParams(reader) {
      return {
        config: {
          type: 'delen',
          divisors: reader.numberSet('div', defaultDelen.divisors, DELEN_DIVISORS),
          layout: readVariation(reader, defaultDelen.layout),
        },
        repaired: reader.didRepair,
      }
    },
  },
}
