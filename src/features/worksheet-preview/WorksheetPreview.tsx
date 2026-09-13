import type { Worksheet } from '@/domain/core'
import '@/features/print/print.css'
import { A4_WIDTH_PX } from '@/features/print/geometry'
import { nl } from '@/i18n/nl'
import { SheetView } from './SheetView'
import { useFitWidth } from './useFitWidth'

export function WorksheetPreview({ worksheet }: { worksheet: Worksheet }) {
  const { ref, scale } = useFitWidth(A4_WIDTH_PX)

  return (
    <div ref={ref} className="worksheet-preview flex flex-col gap-10 overflow-x-auto">
      <SheetView worksheet={worksheet} mode="student" scale={scale} />
      <div
        aria-hidden
        className="worksheet-sheet-break mt-2 flex items-center gap-3 text-xs text-ink-muted print:hidden"
      >
        <span className="h-0.5 flex-1 bg-ink" />
        {nl.sheet.answers}
        <span className="h-0.5 flex-1 bg-ink" />
      </div>
      <SheetView worksheet={worksheet} mode="answers" scale={scale} />
    </div>
  )
}
