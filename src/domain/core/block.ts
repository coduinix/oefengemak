import type { Exercise, Slot } from './exercise'

export type ExerciseType = 'splitsen' | 'plus' | 'min' | 'tafels' | 'delen' | 'breuken'

export const EXERCISE_TYPES: readonly ExerciseType[] = [
  'splitsen',
  'plus',
  'min',
  'tafels',
  'delen',
  'breuken',
]

export interface Block {
  readonly id: string
  readonly blank: Slot
  readonly exercises: readonly Exercise[]
}

export interface Section {
  readonly id: string
  readonly type: ExerciseType
  readonly blocks: readonly Block[]
}

export interface Worksheet {
  readonly title: string
  readonly sections: readonly Section[]
}

export function exerciseCount(worksheet: Worksheet): number {
  return worksheet.sections.reduce(
    (total, section) =>
      total + section.blocks.reduce((sum, block) => sum + block.exercises.length, 0),
    0,
  )
}

export function isEmpty(worksheet: Worksheet): boolean {
  return exerciseCount(worksheet) === 0
}
