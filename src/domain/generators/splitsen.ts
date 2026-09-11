import { err, exercise, int, issue, ok, type Exercise, type Result } from '@/domain/core'
import {
  MAX_BLOCKS,
  MAX_EXERCISES,
  MAX_PER_BLOCK,
  SPLITSEN_NUMBERS,
  defaultSplitsen,
  type SplitsenConfig,
} from '@/domain/config'
import { roundRobinSource, withNoRepeatWithinBlock } from '@/domain/sources'
import { DEFAULT_POOL, type LayoutSpec } from '@/domain/layout'
import type { ExerciseGenerator } from './generator'

/** Every way to split `total` into two parts; the right-hand part is what the pupil fills in. */
function groupForNumber(total: number): Exercise[] {
  return Array.from({ length: total }, (_, left) =>
    exercise(int(left), '+', int(total - left), int(total)),
  )
}

function blockCount(config: SplitsenConfig): number {
  return Math.ceil(config.count / config.perBlock)
}

/** Blocks are always full, so a count that is not a multiple of perBlock rounds up. */
function totalExercises(config: SplitsenConfig): number {
  return blockCount(config) * config.perBlock
}

export const splitsenGenerator: ExerciseGenerator<SplitsenConfig> = {
  type: 'splitsen',
  defaults: defaultSplitsen,
  layout(config): LayoutSpec {
    return { kind: 'flat', perBlock: config.perBlock, blocks: blockCount(config), blank: 'rhs' }
  },
  sources(config) {
    const groups = config.numbers.filter((n) => n > 0).map(groupForNumber)
    return { [DEFAULT_POOL]: withNoRepeatWithinBlock(roundRobinSource(groups), config.perBlock) }
  },
  validate(config): Result<SplitsenConfig> {
    if (config.numbers.filter((n) => n > 0).length === 0) {
      return err([issue('EMPTY_SELECTION', 'numbers')])
    }
    if (config.count === 0) return err([issue('NO_EXERCISES', 'count')])
    if (totalExercises(config) > MAX_EXERCISES) return err([issue('TOO_MANY_EXERCISES', 'count')])
    return ok(config)
  },
  codec: {
    toParams(config, writer) {
      writer.setNumberSet('n', config.numbers)
      writer.set('count', config.count)
      writer.set('pb', config.perBlock)
    },
    fromParams(reader) {
      return {
        config: {
          type: 'splitsen',
          numbers: reader.numberSet('n', defaultSplitsen.numbers, SPLITSEN_NUMBERS),
          count: reader.int('count', defaultSplitsen.count, 0, MAX_BLOCKS * MAX_PER_BLOCK),
          perBlock: reader.int('pb', defaultSplitsen.perBlock, 1, MAX_PER_BLOCK),
        },
        repaired: reader.didRepair,
      }
    },
  },
}
