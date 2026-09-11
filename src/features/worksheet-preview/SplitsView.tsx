import type { Exercise, Slot } from '@/domain/core'
import type { SheetMode } from './mode'
import { TermView } from './TermView'

interface SplitsViewProps {
  exercise: Exercise
  blank: Slot
  mode: SheetMode
}

function Cell({ exercise, slot, blank, mode }: SplitsViewProps & { slot: Slot }) {
  if (slot !== blank) return <TermView term={exercise[slot]} />
  if (mode === 'student') return <span>&nbsp;</span>
  return (
    <strong className="font-bold">
      <TermView term={exercise[slot]} />
    </strong>
  )
}

export function SplitsView({ exercise, blank, mode }: SplitsViewProps) {
  return (
    <div data-testid="exercise-row" className="worksheet grid w-full text-center text-sm">
      <div className="border-b border-line py-1">
        <Cell exercise={exercise} slot="result" blank={blank} mode={mode} />
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r border-line py-1">
          <Cell exercise={exercise} slot="lhs" blank={blank} mode={mode} />
        </div>
        <div className="py-1">
          <Cell exercise={exercise} slot="rhs" blank={blank} mode={mode} />
        </div>
      </div>
    </div>
  )
}
