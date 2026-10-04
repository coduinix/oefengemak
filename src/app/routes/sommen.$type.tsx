import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EXERCISE_TYPES, type ExerciseType } from '@/domain/core'
import { usePrint } from '@/features/print/usePrint'
import { useWorksheetFromUrl } from '@/features/share/useWorksheetFromUrl'
import { WorksheetForm } from '@/features/worksheet-form/WorksheetForm'
import { WorksheetPreview } from '@/features/worksheet-preview/WorksheetPreview'
import { nl, typeStrings } from '@/i18n/nl'
import { useWorksheetFormStore } from '@/stores/worksheet-form-store'
import { NotFoundPage } from './not-found'

function isExerciseType(value: string | undefined): value is ExerciseType {
  return value !== undefined && (EXERCISE_TYPES as readonly string[]).includes(value)
}

function ExercisePage({ type }: { type: ExerciseType }) {
  const { config, title, worksheet, generate } = useWorksheetFromUrl(type)
  const print = usePrint(type)
  const setConfig = useWorksheetFormStore((state) => state.setConfig)
  const setTitle = useWorksheetFormStore((state) => state.setTitle)

  useEffect(() => {
    setConfig(config)
    setTitle(title)
  }, [config, title, setConfig, setTitle])

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="grid gap-4 print:hidden lg:sticky lg:top-24">
        <h1 className="font-display text-2xl font-bold">{typeStrings[type].title}</h1>
        <WorksheetForm
          type={type}
          hasWorksheet={worksheet !== null}
          onGenerate={generate}
          onPrint={print}
        />
      </div>
      {worksheet === null ? (
        <div className="grid content-center gap-2 rounded-card border border-dashed border-line bg-surface p-10 text-center print:hidden">
          <p className="font-display text-lg font-semibold text-brand-ink">
            {nl.preview.emptyTitle}
          </p>
          <p className="text-sm text-ink-muted">{nl.preview.emptyBody}</p>
        </div>
      ) : (
        <WorksheetPreview worksheet={worksheet} />
      )}
    </div>
  )
}

export function SommenPage() {
  const { type } = useParams()
  if (!isExerciseType(type)) return <NotFoundPage />
  return <ExercisePage type={type} />
}
