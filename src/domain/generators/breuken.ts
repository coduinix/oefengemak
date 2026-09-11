import {
  err,
  exercise,
  frac,
  issue,
  ok,
  type Exercise,
  type Operator,
  type Result,
  type Term,
} from '@/domain/core'
import * as F from '@/domain/core/fraction'
import {
  MAX_BLOCKS,
  MAX_EXERCISES,
  MAX_PER_BLOCK,
  defaultBreuken,
  type BreukenConfig,
} from '@/domain/config'
import { rejectionSource } from '@/domain/sources'
import type { Rng } from '@/domain/rng'
import type { GroupPlan, LayoutSpec } from '@/domain/layout'
import type { ExerciseGenerator } from './generator'

export type FractionOp = 'add' | 'sub' | 'mul' | 'div'

const OPERATORS: Readonly<Record<FractionOp, Operator>> = {
  add: '+',
  sub: '-',
  mul: '×',
  div: ':',
}

/** Blocks are operator-homogeneous and always appear in this order, as on the legacy site. */
export const FRACTION_OPS: readonly FractionOp[] = ['add', 'sub', 'mul', 'div']

/** Always a proper fraction: 0 < n < d, so operands read as real fractions rather than 1 or 0. */
function randomProperFraction(maxDenominator: number, rng: Rng): F.Fraction {
  const d = rng.int(2, maxDenominator)
  return { n: rng.int(1, d - 1), d }
}

function attempt(op: FractionOp, maxDenominator: number) {
  return (rng: Rng): Exercise | null => {
    const lhs = randomProperFraction(maxDenominator, rng)
    const rhs = randomProperFraction(maxDenominator, rng)
    const raw =
      op === 'add'
        ? F.add(lhs, rhs)
        : op === 'sub'
          ? F.subtract(lhs, rhs)
          : op === 'mul'
            ? F.multiply(lhs, rhs)
            : F.divide(lhs, rhs)
    const result = F.reduce(raw)
    if (result.n < 0) return null
    return exercise(term(lhs), OPERATORS[op], term(rhs), term(result))
  }
}

const term = (f: F.Fraction): Term => frac(f.n, f.d)

function totalExercises(config: BreukenConfig): number {
  const { add, sub, mul, div } = config.counts
  return config.perBlock * (add + sub + mul + div)
}

export const breukenGenerator: ExerciseGenerator<BreukenConfig> = {
  type: 'breuken',
  defaults: defaultBreuken,
  layout(config): LayoutSpec {
    const groups: GroupPlan[] = FRACTION_OPS.map((op) => ({
      key: op,
      blocks: config.counts[op],
      blank: 'result' as const,
    }))
    return { kind: 'grouped', perBlock: config.perBlock, groups }
  },
  sources(config) {
    return Object.fromEntries(
      FRACTION_OPS.map((op) => [op, rejectionSource(attempt(op, config.maxDenominator))]),
    )
  },
  validate(config): Result<BreukenConfig> {
    const total = totalExercises(config)
    if (total === 0) return err([issue('NO_EXERCISES')])
    if (total > MAX_EXERCISES) return err([issue('TOO_MANY_EXERCISES')])
    return ok(config)
  },
  codec: {
    toParams(config, writer) {
      writer.set('den', config.maxDenominator)
      writer.set('pb', config.perBlock)
      for (const op of FRACTION_OPS) writer.set(op, config.counts[op])
    },
    fromParams(reader) {
      const counts = Object.fromEntries(
        FRACTION_OPS.map((op) => [op, reader.int(op, defaultBreuken.counts[op], 0, MAX_BLOCKS)]),
      ) as BreukenConfig['counts']
      return {
        config: {
          type: 'breuken',
          maxDenominator: reader.oneOfNumber('den', defaultBreuken.maxDenominator, [10, 50, 100]),
          perBlock: reader.int('pb', defaultBreuken.perBlock, 1, MAX_PER_BLOCK),
          counts,
        },
        repaired: reader.didRepair,
      }
    },
  },
}
