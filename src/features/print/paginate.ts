export interface PageCapacity {
  readonly columns: number
  readonly firstPageContentHeightPx: number
  readonly laterPageContentHeightPx: number
  readonly rowGapPx: number
}

/**
 * Groups block indices into pages, simulating the row-major CSS grid packing the
 * preview itself uses (row height = max of that row's blocks). A row taller than a
 * page's budget still gets its own page rather than being dropped or looping forever.
 */
export function paginateBlocks(
  blockHeightsPx: readonly number[],
  capacity: PageCapacity,
): number[][] {
  if (blockHeightsPx.length === 0) return [[]]

  const rows: number[][] = []
  for (let i = 0; i < blockHeightsPx.length; i += capacity.columns) {
    const row: number[] = []
    for (let j = i; j < Math.min(i + capacity.columns, blockHeightsPx.length); j++) row.push(j)
    rows.push(row)
  }

  const pages: number[][] = []
  let currentPage: number[] = []
  let currentPageRowCount = 0
  let currentPageHeightPx = 0

  for (const row of rows) {
    const rowHeightPx = Math.max(...row.map((index) => blockHeightsPx[index] ?? 0))
    const budget =
      pages.length === 0 ? capacity.firstPageContentHeightPx : capacity.laterPageContentHeightPx
    const additionalHeightPx = rowHeightPx + (currentPageRowCount > 0 ? capacity.rowGapPx : 0)

    if (currentPageRowCount > 0 && currentPageHeightPx + additionalHeightPx > budget) {
      pages.push(currentPage)
      currentPage = []
      currentPageRowCount = 0
      currentPageHeightPx = 0
    }

    currentPage.push(...row)
    currentPageHeightPx += rowHeightPx + (currentPageRowCount > 0 ? capacity.rowGapPx : 0)
    currentPageRowCount++
  }

  pages.push(currentPage)
  return pages
}
