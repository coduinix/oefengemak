import type { Exercise } from '@/domain/core'
import type { Rng } from '@/domain/rng'
import type { ExerciseSource } from './exercise-source'

/** Emits a full permutation of its group before repeating anything. */
function createCycler(group: readonly Exercise[], rng: Rng) {
  let remaining: Exercise[] = []
  return (): Exercise => {
    if (remaining.length === 0) remaining = rng.shuffle(group)
    return remaining.pop() as Exercise
  }
}

/**
 * Draws in strict round-robin across groups, so the number of exercises taken from any two
 * groups differs by at most one. That balance is the behaviour teachers rely on.
 */
export function roundRobinSource(groups: readonly (readonly Exercise[])[]): ExerciseSource {
  const usable = groups.filter((group) => group.length > 0)
  return {
    draw(count, rng) {
      if (count <= 0 || usable.length === 0) return []
      const cyclers = rng.shuffle(usable).map((group) => createCycler(group, rng))
      const out: Exercise[] = []
      for (let i = 0; i < count; i++) {
        out.push((cyclers[i % cyclers.length] as () => Exercise)())
      }
      return out
    },
  }
}
