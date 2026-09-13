import type { Worksheet } from '@/domain/core'
import { A4_WIDTH_PX } from '@/features/print/geometry'
import { BlockView } from './BlockView'
import { SheetHeader } from './SheetHeader'
import type { SheetMode } from './mode'
import type { BlockEntry } from './usePaginatedBlocks'

interface MeasurementProbeProps {
  worksheet: Worksheet
  mode: SheetMode
  entries: readonly BlockEntry[]
  registerBlock: (id: string) => (element: HTMLElement | null) => void
  registerHeader: (element: HTMLElement | null) => void
  registerRuler: (element: HTMLElement | null) => void
  registerGrid: (element: HTMLElement | null) => void
}

/**
 * Renders every block once, off-screen at true A4 width, purely so
 * usePaginatedBlocks can read real DOM heights before painting the paginated
 * sheet. Kept mounted (not just rendered once) so a late web-font swap keeps
 * pagination correct. Markup here must match the real render exactly.
 */
export function MeasurementProbe({
  worksheet,
  mode,
  entries,
  registerBlock,
  registerHeader,
  registerRuler,
  registerGrid,
}: MeasurementProbeProps) {
  return (
    <div
      aria-hidden
      data-measurement-probe
      className="print:hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        width: A4_WIDTH_PX,
      }}
    >
      <div ref={registerHeader} className="flow-root">
        <SheetHeader worksheet={worksheet} mode={mode} />
      </div>
      <div ref={registerGrid} className="grid grid-cols-4 gap-3">
        {entries.map((entry) => (
          <div key={entry.id} ref={registerBlock(entry.id)}>
            <BlockView block={entry.block} type={entry.type} mode={mode} />
          </div>
        ))}
      </div>
      <div ref={registerRuler} className="worksheet-page" />
    </div>
  )
}
