import type { ExerciseType } from '@/domain/core'
import type { ExerciseConfig } from '@/domain/config'
import type { LayoutSpec } from '@/domain/layout'
import type { ExerciseSource } from '@/domain/sources'
import type { ConfigCodec } from '@/domain/url/codec'
import type { Result } from '@/domain/core'

export interface ExerciseGenerator<C extends ExerciseConfig> {
  readonly type: C['type'] & ExerciseType
  readonly defaults: C
  layout(config: C): LayoutSpec
  sources(config: C): Readonly<Record<string, ExerciseSource>>
  validate(config: C): Result<C>
  readonly codec: ConfigCodec<C>
}

export type AnyExerciseGenerator = {
  [T in ExerciseType]: ExerciseGenerator<Extract<ExerciseConfig, { type: T }>>
}[ExerciseType]
