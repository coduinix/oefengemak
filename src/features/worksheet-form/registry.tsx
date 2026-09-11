import type { ComponentType } from 'react'
import type { ExerciseConfig } from '@/domain/config'
import type { ExerciseType } from '@/domain/core'
import { BreukenOptions } from './options/BreukenOptions'
import { DelenOptions } from './options/DelenOptions'
import { MinOptions } from './options/MinOptions'
import { PlusOptions } from './options/PlusOptions'
import { SplitsenOptions } from './options/SplitsenOptions'
import { TafelsOptions } from './options/TafelsOptions'
import type { OptionsProps } from './options/types'

type OptionsRegistry = {
  [T in ExerciseType]: ComponentType<OptionsProps<Extract<ExerciseConfig, { type: T }>>>
}

const registry: OptionsRegistry = {
  splitsen: SplitsenOptions,
  plus: PlusOptions,
  min: MinOptions,
  tafels: TafelsOptions,
  delen: DelenOptions,
  breuken: BreukenOptions,
}

/** Which fields each options component renders an inline error for; the rest go above the buttons. */
const inlineFields: Readonly<Record<ExerciseType, readonly string[]>> = {
  splitsen: ['numbers', 'count'],
  plus: [],
  min: [],
  tafels: ['tables'],
  delen: ['divisors'],
  breuken: [],
}

export function inlineFieldsFor(type: ExerciseType): readonly string[] {
  return inlineFields[type]
}

export function OptionsPanel({ config, onChange, issues }: OptionsProps<ExerciseConfig>) {
  const Component = registry[config.type] as unknown as ComponentType<OptionsProps<ExerciseConfig>>
  return <Component config={config} onChange={onChange} issues={issues} />
}
