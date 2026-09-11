import type { Worksheet } from '@/domain/core'
import '@/features/print/print.css'
import { SheetView } from './SheetView'

export function WorksheetPreview({ worksheet }: { worksheet: Worksheet }) {
  return (
    <div className="worksheet-preview grid gap-6">
      <SheetView worksheet={worksheet} mode="student" />
      <SheetView worksheet={worksheet} mode="answers" />
    </div>
  )
}
