import { err, exercise, int, issue, type Exercise, type Result } from '@/domain/core'
import { TAFELS_NUMBERS, defaultTafels, type TafelsConfig } from '@/domain/config'
import { roundRobinSource, withNoRepeatWithinBlock } from '@/domain/sources'
import {
  VARIATION_POOL,
  readVariation,
  validateVariation,
  variationLayout,
  writeVariation,
} from './variation'
import type { ExerciseGenerator } from './generator'

const MULTIPLICANDS = 10

function groupForTable(table: number): Exercise[] {
  return Array.from({ length: MULTIPLICANDS }, (_, i) =>
    exercise(int(i + 1), '×', int(table), int((i + 1) * table)),
  )
}

export const tafelsGenerator: ExerciseGenerator<TafelsConfig> = {
  type: 'tafels',
  defaults: defaultTafels,
  layout: (config) => variationLayout(config.layout),
  sources(config) {
    const groups = config.tables.map(groupForTable)
    return {
      [VARIATION_POOL]: withNoRepeatWithinBlock(roundRobinSource(groups), config.layout.perBlock),
    }
  },
  validate(config): Result<TafelsConfig> {
    if (config.tables.length === 0) return err([issue('EMPTY_SELECTION', 'tables')])
    return validateVariation(config)
  },
  codec: {
    toParams(config, writer) {
      writer.setNumberSet('tab', config.tables)
      writeVariation(config.layout, writer)
    },
    fromParams(reader) {
      return {
        config: {
          type: 'tafels',
          tables: reader.numberSet('tab', defaultTafels.tables, TAFELS_NUMBERS),
          layout: readVariation(reader, defaultTafels.layout),
        },
        repaired: reader.didRepair,
      }
    },
  },
}
