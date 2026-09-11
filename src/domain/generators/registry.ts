import type { ExerciseType } from '@/domain/core'
import type { ExerciseConfig } from '@/domain/config'
import type { AnyExerciseGenerator, ExerciseGenerator } from './generator'
import { splitsenGenerator } from './splitsen'
import { plusGenerator } from './plus'
import { minGenerator } from './min'
import { tafelsGenerator } from './tafels'
import { delenGenerator } from './delen'
import { breukenGenerator } from './breuken'

type Registry = { [T in ExerciseType]: ExerciseGenerator<Extract<ExerciseConfig, { type: T }>> }

const REGISTRY: Registry = {
  splitsen: splitsenGenerator,
  plus: plusGenerator,
  min: minGenerator,
  tafels: tafelsGenerator,
  delen: delenGenerator,
  breuken: breukenGenerator,
}

export function getGenerator<T extends ExerciseType>(type: T): Registry[T] {
  return REGISTRY[type]
}

export function generatorFor(config: ExerciseConfig): AnyExerciseGenerator {
  return REGISTRY[config.type]
}

export const allGenerators: readonly AnyExerciseGenerator[] = Object.values(REGISTRY)
