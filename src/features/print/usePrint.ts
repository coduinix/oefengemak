import { useCallback } from 'react'
import type { ExerciseType } from '@/domain/core'
import { trackEvent } from '@/lib/analytics'
import { typeStrings } from '@/i18n/nl'

export function usePrint(type: ExerciseType): () => void {
  return useCallback(() => {
    trackEvent('Oefenblad', 'print', typeStrings[type].name)
    window.print()
  }, [type])
}
