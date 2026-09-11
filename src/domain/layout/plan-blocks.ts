import type { Slot } from '@/domain/core'
import { DEFAULT_POOL, type BlockPlan, type LayoutSpec } from './layout-spec'

/**
 * Blocks appear on the sheet as result…, rhs…, lhs… — deliberately not the order the config panel
 * lists them in (result, lhs, rhs). Carried over from the legacy site so sheets look unchanged.
 */
const VARIATION_ORDER: readonly Slot[] = ['result', 'rhs', 'lhs']

export function planBlocks(spec: LayoutSpec): BlockPlan[] {
  const perBlock = Math.max(0, Math.trunc(spec.perBlock))
  if (perBlock === 0) return []

  switch (spec.kind) {
    case 'variation':
      return VARIATION_ORDER.flatMap((blank) =>
        repeat(Math.max(0, Math.trunc(spec.counts[blank])), {
          blank,
          size: perBlock,
          poolKey: DEFAULT_POOL,
        }),
      )
    case 'flat':
      return repeat(Math.max(0, Math.trunc(spec.blocks)), {
        blank: spec.blank,
        size: perBlock,
        poolKey: DEFAULT_POOL,
      })
    case 'grouped':
      return spec.groups.flatMap((group) =>
        repeat(Math.max(0, Math.trunc(group.blocks)), {
          blank: group.blank,
          size: perBlock,
          poolKey: group.key,
        }),
      )
  }
}

export function plannedExerciseCount(plans: readonly BlockPlan[]): number {
  return plans.reduce((total, plan) => total + plan.size, 0)
}

function repeat(times: number, plan: BlockPlan): BlockPlan[] {
  return Array.from({ length: times }, () => plan)
}
