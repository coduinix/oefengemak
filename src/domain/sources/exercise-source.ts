import type { Exercise } from '@/domain/core'
import type { Rng } from '@/domain/rng'

export interface ExerciseSource {
  draw(count: number, rng: Rng): Exercise[]
}

export const emptySource: ExerciseSource = { draw: () => [] }
