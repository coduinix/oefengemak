import type { Worksheet } from '@/domain/core'
import { nl } from '@/i18n/nl'
import { BlockView } from './BlockView'
import type { SheetMode } from './mode'

interface SheetViewProps {
  worksheet: Worksheet
  mode: SheetMode
}

export function SheetView({ worksheet, mode }: SheetViewProps) {
  return (
    <section className="worksheet-sheet">
      <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <h2 className="font-display text-xl font-semibold">
          {worksheet.title === '' ? nl.sheet.untitled : worksheet.title}
        </h2>
        <p className="text-sm text-ink">
          {mode === 'student' ? `${nl.sheet.name} ${nl.sheet.nameRule}` : nl.sheet.answers}
        </p>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4">
        {worksheet.sections.flatMap((section) =>
          section.blocks.map((block) => (
            <BlockView key={block.id} block={block} type={section.type} mode={mode} />
          )),
        )}
      </div>
    </section>
  )
}
