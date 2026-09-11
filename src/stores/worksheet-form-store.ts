import { create } from 'zustand'
import { defaultConfigs, type ExerciseConfig } from '@/domain/config'
import type { ExerciseType } from '@/domain/core'

interface WorksheetFormState {
  config: ExerciseConfig
  title: string
  setTitle: (title: string) => void
  setConfig: (config: ExerciseConfig) => void
  reset: (type: ExerciseType) => void
}

export const useWorksheetFormStore = create<WorksheetFormState>((set) => ({
  config: defaultConfigs.plus,
  title: '',
  setTitle: (title) => set({ title }),
  setConfig: (config) => set({ config }),
  reset: (type) => set({ config: defaultConfigs[type], title: '' }),
}))
