import type { Block, ExerciseType } from '@/domain/core'
import { ExerciseRow } from './ExerciseRow'
import { SplitsView } from './SplitsView'
import type { SheetMode } from './mode'

interface BlockViewProps {
  block: Block
  type: ExerciseType
  mode: SheetMode
}

export function BlockView({ block, type, mode }: BlockViewProps) {
  return (
    <div className="worksheet-block grid gap-2 rounded-md border border-line p-2">
      {block.exercises.map((exercise, index) =>
        type === 'splitsen' ? (
          <SplitsView key={index} exercise={exercise} blank={block.blank} mode={mode} />
        ) : (
          <ExerciseRow key={index} exercise={exercise} blank={block.blank} mode={mode} />
        ),
      )}
    </div>
  )
}
