import { GenerationError, type Exercise } from '@/domain/core'
import type { Rng } from '@/domain/rng'
import type { ExerciseSource } from './exercise-source'

export const ATTEMPTS_PER_EXERCISE = 100

/**
 * Samples until `attempt` yields an acceptable exercise. Bounded on purpose: an unsatisfiable
 * predicate must fail loudly rather than hang the tab.
 */
export function rejectionSource(
  attempt: (rng: Rng) => Exercise | null,
  attemptsPerExercise = ATTEMPTS_PER_EXERCISE,
): ExerciseSource {
  return {
    draw(count, rng) {
      if (count <= 0) return []
      const out: Exercise[] = []
      let budget = count * attemptsPerExercise
      while (out.length < count) {
        if (budget-- <= 0) {
          throw new GenerationError(
            `Could not sample ${count} exercises within ${count * attemptsPerExercise} attempts`,
          )
        }
        const candidate = attempt(rng)
        if (candidate !== null) out.push(candidate)
      }
      return out
    },
  }
}
