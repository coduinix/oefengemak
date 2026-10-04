import type { Exercise, Slot } from '@/domain/core'
import type { SheetMode } from './mode'
import { TermView } from './TermView'

interface SlotViewProps {
  exercise: Exercise
  slot: Slot
  blank: Slot
  mode: SheetMode
}

function SlotView({ exercise, slot, blank, mode }: SlotViewProps) {
  if (slot !== blank) return <TermView term={exercise[slot]} />
  if (mode === 'student') return <span aria-hidden="true">...</span>
  return (
    <strong className="font-bold">
      <TermView term={exercise[slot]} />
    </strong>
  )
}

interface ExerciseRowProps {
  exercise: Exercise
  blank: Slot
  mode: SheetMode
}

export function ExerciseRow({ exercise, blank, mode }: ExerciseRowProps) {
  return (
    <div
      data-testid="exercise-row"
      className="worksheet grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 text-sm"
    >
      <span className="justify-self-center">
        <SlotView exercise={exercise} slot="lhs" blank={blank} mode={mode} />
      </span>
      <span className="text-ink-muted">{exercise.operator}</span>
      <span className="justify-self-center">
        <SlotView exercise={exercise} slot="rhs" blank={blank} mode={mode} />
      </span>
      <span className="text-ink-muted">=</span>
      <span className="justify-self-center">
        <SlotView exercise={exercise} slot="result" blank={blank} mode={mode} />
      </span>
    </div>
  )
}
