import type { Slot } from '@/domain/core'

export const DEFAULT_POOL = 'default'

export interface BlockPlan {
  readonly blank: Slot
  readonly size: number
  readonly poolKey: string
}

export interface VariationCounts {
  readonly result: number
  readonly lhs: number
  readonly rhs: number
}

export interface GroupPlan {
  readonly key: string
  readonly blocks: number
  readonly blank: Slot
}

export type LayoutSpec =
  | { readonly kind: 'variation'; readonly perBlock: number; readonly counts: VariationCounts }
  | {
      readonly kind: 'flat'
      readonly perBlock: number
      readonly blocks: number
      readonly blank: Slot
    }
  | { readonly kind: 'grouped'; readonly perBlock: number; readonly groups: readonly GroupPlan[] }
