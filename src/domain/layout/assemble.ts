import type { Block } from '@/domain/core'
import type { Rng } from '@/domain/rng'
import type { ExerciseSource } from '@/domain/sources'
import type { BlockPlan } from './layout-spec'

/**
 * Draws one flat pool per poolKey and slices it front-to-back into blocks, so blocks drawn from
 * the same pool never share an exercise.
 */
export function assemble(
  plans: readonly BlockPlan[],
  sources: Readonly<Record<string, ExerciseSource>>,
  rng: Rng,
  idPrefix: string,
): Block[] {
  const needed = new Map<string, number>()
  for (const plan of plans) {
    needed.set(plan.poolKey, (needed.get(plan.poolKey) ?? 0) + plan.size)
  }

  const pools = new Map<string, { items: ReturnType<ExerciseSource['draw']>; next: number }>()
  for (const [key, count] of needed) {
    const source = sources[key]
    if (source === undefined) throw new Error(`No exercise source registered for pool "${key}"`)
    pools.set(key, { items: source.draw(count, rng), next: 0 })
  }

  return plans.map((plan, index) => {
    const pool = pools.get(plan.poolKey)
    const exercises = pool === undefined ? [] : pool.items.slice(pool.next, pool.next + plan.size)
    if (pool !== undefined) pool.next += plan.size
    return { id: `${idPrefix}-b${index}`, blank: plan.blank, exercises }
  })
}
