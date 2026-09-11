import { sameExercise, type Exercise } from '@/domain/core'
import type { ExerciseSource } from './exercise-source'

/**
 * Avoids printing the same sum twice inside one box. Best-effort: when a block's pool is smaller
 * than the block, duplicates are kept rather than failing the worksheet.
 */
export function withNoRepeatWithinBlock(source: ExerciseSource, blockSize: number): ExerciseSource {
  if (blockSize <= 1) return source
  return {
    draw(count, rng) {
      if (count <= 0) return []
      const pool = source.draw(count * 2, rng)
      if (pool.length < count) return source.draw(count, rng)

      const out: Exercise[] = []
      let spareIndex = count
      for (let i = 0; i < count; i++) {
        let candidate = pool[i] as Exercise
        const blockStart = Math.floor(i / blockSize) * blockSize
        const inBlock = () => out.slice(blockStart).some((seen) => sameExercise(seen, candidate))
        while (spareIndex < pool.length && inBlock()) {
          candidate = pool[spareIndex++] as Exercise
        }
        out.push(candidate)
      }
      return out
    },
  }
}
