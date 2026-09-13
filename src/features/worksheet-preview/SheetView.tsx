import { Fragment, useMemo } from 'react'
import type { Worksheet } from '@/domain/core'
import { A4_HEIGHT_PX, A4_WIDTH_PX } from '@/features/print/geometry'
import { cn } from '@/lib/cn'
import { BlockView } from './BlockView'
import { MeasurementProbe } from './MeasurementProbe'
import { SheetHeader } from './SheetHeader'
import type { SheetMode } from './mode'
import { type BlockEntry, usePaginatedBlocks } from './usePaginatedBlocks'

const PAGE_BREAK_GAP_PX = 24 // matches the h-6 divider between pages

interface SheetViewProps {
  worksheet: Worksheet
  mode: SheetMode
  /** Scale the whole sheet down to fit a viewport. Omit to render at natural A4 size. */
  scale?: number
}

export function SheetView({ worksheet, mode, scale }: SheetViewProps) {
  const entries = useMemo<BlockEntry[]>(
    () =>
      worksheet.sections.flatMap((section) =>
        section.blocks.map((block) => ({ id: block.id, block, type: section.type })),
      ),
    [worksheet],
  )

  const { pages, isMeasuring, registerBlock, registerHeader, registerRuler, registerGrid } =
    usePaginatedBlocks(entries)

  const probe = (
    <MeasurementProbe
      worksheet={worksheet}
      mode={mode}
      entries={entries}
      registerBlock={registerBlock}
      registerHeader={registerHeader}
      registerRuler={registerRuler}
      registerGrid={registerGrid}
    />
  )

  if (isMeasuring) {
    return <section className="worksheet-sheet">{probe}</section>
  }

  const content = pages.map((pageEntries, index) => (
    <Fragment key={index}>
      {index > 0 && (
        <div
          aria-hidden
          className="worksheet-page-break h-6 border-t border-dashed border-line print:hidden"
        />
      )}
      <div
        className={cn(
          'worksheet-page',
          mode === 'answers' && index === pages.length - 1 && 'worksheet-page--last',
        )}
      >
        {index === 0 && <SheetHeader worksheet={worksheet} mode={mode} />}
        <div className="grid grid-cols-4 gap-3">
          {pageEntries.map((entry) => (
            <BlockView key={entry.id} block={entry.block} type={entry.type} mode={mode} />
          ))}
        </div>
      </div>
    </Fragment>
  ))

  if (scale === undefined) {
    return (
      <section className="worksheet-sheet">
        {content}
        {probe}
      </section>
    )
  }

  const naturalHeightPx = pages.length * A4_HEIGHT_PX + (pages.length - 1) * PAGE_BREAK_GAP_PX

  return (
    <section
      className="worksheet-sheet relative"
      style={{ width: A4_WIDTH_PX * scale, height: naturalHeightPx * scale }}
    >
      <div
        className="worksheet-scale"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: A4_WIDTH_PX,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {content}
      </div>
      {probe}
    </section>
  )
}
