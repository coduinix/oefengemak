import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { ExerciseConfig } from '@/domain/config'
import type { ExerciseType, Worksheet } from '@/domain/core'
import { buildWorksheetUrl, decodeWorksheet } from '@/domain/url'
import { generateWorksheet } from '@/domain/worksheet'
import { trackEvent } from '@/lib/analytics'
import { randomSeed } from '@/lib/random-seed'
import { nl, typeStrings } from '@/i18n/nl'

interface WorksheetFromUrl {
  config: ExerciseConfig
  title: string
  worksheet: Worksheet | null
  generate: (config: ExerciseConfig, title: string) => void
}

export function useWorksheetFromUrl(type: ExerciseType): WorksheetFromUrl {
  const [search] = useSearchParams()
  const navigate = useNavigate()

  const decoded = useMemo(() => decodeWorksheet(type, search), [type, search])
  const worksheet = useMemo(
    () => (decoded.spec === null ? null : generateWorksheet(decoded.spec)),
    [decoded.spec],
  )

  const reportedRepair = useRef<string | null>(null)
  useEffect(() => {
    const key = `${type}?${search.toString()}`
    if (!decoded.repaired || reportedRepair.current === key) return
    reportedRepair.current = key
    toast.warning(nl.toast.repaired)
  }, [decoded.repaired, search, type])

  const generate = useCallback(
    (config: ExerciseConfig, title: string) => {
      trackEvent('Oefenblad', 'genereer', typeStrings[config.type].name)
      navigate(buildWorksheetUrl(config, randomSeed(), title))
    },
    [navigate],
  )

  return { config: decoded.config, title: decoded.title, worksheet, generate }
}
