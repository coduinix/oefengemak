import type { Worksheet } from '@/domain/core'
import { nl } from '@/i18n/nl'
import type { SheetMode } from './mode'

interface SheetHeaderProps {
  worksheet: Worksheet
  mode: SheetMode
}

// Rendered identically by the measurement probe and the real first page —
// keep this the single source of that markup, or measured heights go wrong.
export function SheetHeader({ worksheet, mode }: SheetHeaderProps) {
  return (
    <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-2">
      <h2 className="font-display text-xl font-semibold">
        {worksheet.title === '' ? nl.sheet.untitled : worksheet.title}
      </h2>
      <p className="text-sm text-ink">
        {mode === 'student' ? `${nl.sheet.name} ${nl.sheet.nameRule}` : nl.sheet.answers}
      </p>
    </header>
  )
}
