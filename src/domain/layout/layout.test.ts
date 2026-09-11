import { describe, expect, it } from 'vitest'
import { exercise, int, type Exercise } from '@/domain/core'
import { createRng } from '@/domain/rng'
import type { ExerciseSource } from '@/domain/sources'
import { planBlocks, plannedExerciseCount } from './plan-blocks'
import { assemble } from './assemble'
import { DEFAULT_POOL } from './layout-spec'

const counting = (offset: number): ExerciseSource => ({
  draw: (count) =>
    Array.from({ length: count }, (_, i) =>
      exercise(int(offset + i), '+', int(0), int(offset + i)),
    ),
})

const lhsValues = (exercises: readonly Exercise[]) =>
  exercises.map((e) => (e.lhs.kind === 'int' ? e.lhs.value : -1))

describe('planBlocks', () => {
  it('orders variation blocks result, rhs, lhs', () => {
    const plans = planBlocks({
      kind: 'variation',
      perBlock: 5,
      counts: { result: 2, lhs: 3, rhs: 1 },
    })
    expect(plans.map((p) => p.blank)).toEqual(['result', 'result', 'rhs', 'lhs', 'lhs', 'lhs'])
    expect(plannedExerciseCount(plans)).toBe(30)
  })

  it('orders grouped blocks by declaration and keeps them homogeneous', () => {
    const plans = planBlocks({
      kind: 'grouped',
      perBlock: 2,
      groups: [
        { key: 'add', blocks: 2, blank: 'result' },
        { key: 'sub', blocks: 1, blank: 'result' },
      ],
    })
    expect(plans.map((p) => p.poolKey)).toEqual(['add', 'add', 'sub'])
  })

  it('produces nothing for zero blocks or a zero block size', () => {
    expect(planBlocks({ kind: 'flat', perBlock: 5, blocks: 0, blank: 'rhs' })).toEqual([])
    expect(planBlocks({ kind: 'flat', perBlock: 0, blocks: 4, blank: 'rhs' })).toEqual([])
    expect(
      planBlocks({ kind: 'variation', perBlock: 5, counts: { result: 0, lhs: 0, rhs: 0 } }),
    ).toEqual([])
  })
})

describe('assemble', () => {
  it('slices one pool front to back so blocks never share an exercise', () => {
    const plans = planBlocks({ kind: 'flat', perBlock: 3, blocks: 3, blank: 'rhs' })
    const blocks = assemble(plans, { [DEFAULT_POOL]: counting(0) }, createRng(1), 's0')
    expect(blocks.map((b) => lhsValues(b.exercises))).toEqual([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ])
    expect(blocks.map((b) => b.id)).toEqual(['s0-b0', 's0-b1', 's0-b2'])
  })

  it('draws each pool independently', () => {
    const plans = planBlocks({
      kind: 'grouped',
      perBlock: 2,
      groups: [
        { key: 'add', blocks: 1, blank: 'result' },
        { key: 'sub', blocks: 1, blank: 'result' },
      ],
    })
    const blocks = assemble(plans, { add: counting(0), sub: counting(100) }, createRng(1), 's0')
    expect(blocks.map((b) => lhsValues(b.exercises))).toEqual([
      [0, 1],
      [100, 101],
    ])
  })

  it('fails loudly when a plan names an unknown pool', () => {
    const plans = planBlocks({
      kind: 'grouped',
      perBlock: 1,
      groups: [{ key: 'missing', blocks: 1, blank: 'result' }],
    })
    expect(() => assemble(plans, {}, createRng(1), 's0')).toThrow(/missing/)
  })
})
