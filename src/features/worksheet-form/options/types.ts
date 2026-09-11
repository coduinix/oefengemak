import type { ExerciseConfig } from '@/domain/config'
import type { ValidationIssue } from '@/domain/core'

export interface OptionsProps<C extends ExerciseConfig> {
  config: C
  onChange: (config: C) => void
  issues: readonly ValidationIssue[]
}
