import { useCallback, useMemo, useRef, useState } from 'react'
import type { Block, ExerciseType } from '@/domain/core'
import { paginateBlocks } from '@/features/print/paginate'
import { useBlockHeights } from './useBlockHeights'

export interface BlockEntry {
  readonly id: string
  readonly block: Block
  readonly type: ExerciseType
}

interface UsePaginatedBlocksResult {
  pages: BlockEntry[][]
  isMeasuring: boolean
  registerBlock: (id: string) => (element: HTMLElement | null) => void
  registerHeader: (element: HTMLElement | null) => void
  registerRuler: (element: HTMLElement | null) => void
  registerGrid: (element: HTMLElement | null) => void
}

const COLUMNS = 4

function useElementHeight(box: 'border' | 'content' = 'border') {
  const [height, setHeight] = useState<number | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  const register = useCallback(
    (element: HTMLElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null
      if (element === null) return
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (entry === undefined) return
        setHeight(
          box === 'content'
            ? entry.contentRect.height
            : (entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height),
        )
      })
      observer.observe(element)
      observerRef.current = observer
    },
    [box],
  )
  return { height, register }
}

/**
 * Chunks a flat list of blocks into A4 pages, based on real measured DOM heights
 * (via the invisible MeasurementProbe), so the on-screen preview shows exactly
 * what will print — see specs/print.md and the pagination ADR.
 */
export function usePaginatedBlocks(entries: readonly BlockEntry[]): UsePaginatedBlocksResult {
  const { heights, register: registerBlock } = useBlockHeights()
  const header = useElementHeight('border')
  const ruler = useElementHeight('content')
  const [rowGapPx, setRowGapPx] = useState<number | null>(null)

  const registerGrid = useCallback((element: HTMLElement | null) => {
    if (element === null) return
    setRowGapPx(parseFloat(getComputedStyle(element).rowGap) || 0)
  }, [])

  const allMeasured =
    header.height !== null &&
    ruler.height !== null &&
    rowGapPx !== null &&
    entries.every((entry) => heights.has(entry.id))

  const pages = useMemo<BlockEntry[][]>(() => {
    if (!allMeasured) return []
    const blockHeightsPx = entries.map((entry) => heights.get(entry.id) ?? 0)
    const pageContentHeightPx = ruler.height ?? 0
    const indexPages = paginateBlocks(blockHeightsPx, {
      columns: COLUMNS,
      firstPageContentHeightPx: pageContentHeightPx - (header.height ?? 0),
      laterPageContentHeightPx: pageContentHeightPx,
      rowGapPx: rowGapPx ?? 0,
    })
    return indexPages.map((indexes) => indexes.map((index) => entries[index]!))
  }, [allMeasured, entries, heights, ruler.height, header.height, rowGapPx])

  return {
    pages,
    isMeasuring: !allMeasured,
    registerBlock,
    registerHeader: header.register,
    registerRuler: ruler.register,
    registerGrid,
  }
}
