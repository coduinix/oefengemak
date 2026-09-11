import type { ExerciseConfig } from '@/domain/config'
import type { Seed } from '@/domain/rng'

export interface SectionSpec {
  readonly config: ExerciseConfig
}

export interface WorksheetSpec {
  readonly title: string
  readonly seed: Seed
  readonly sections: readonly SectionSpec[]
}
