import type { Exercise, ExerciseConfig, Section } from './types'
import { createRng } from '@/domain/rng'
import { generateSection } from '@/domain/worksheet'

export function sectionFor(config: ExerciseConfig, seed: number): Section {
  return generateSection(config, createRng(seed), 's0')
}

export function exercisesOf(section: Section): Exercise[] {
  return section.blocks.flatMap((block) => [...block.exercises])
}
