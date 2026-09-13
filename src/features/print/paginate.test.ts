import { describe, expect, it } from 'vitest'
import { paginateBlocks } from './paginate'

const capacity = (overrides: Partial<Parameters<typeof paginateBlocks>[1]> = {}) => ({
  columns: 4,
  firstPageContentHeightPx: 100,
  laterPageContentHeightPx: 100,
  rowGapPx: 10,
  ...overrides,
})

describe('paginateBlocks', () => {
  it('returns one empty page for no blocks', () => {
    expect(paginateBlocks([], capacity())).toEqual([[]])
  })

  it('keeps everything on one page when it fits', () => {
    const heights = [20, 20, 20, 20, 20, 20, 20, 20]
    expect(paginateBlocks(heights, capacity())).toEqual([[0, 1, 2, 3, 4, 5, 6, 7]])
  })

  it('splits at the row boundary once a page overflows', () => {
    // row 1 (0-3): height 40, row 2 (4-7): height 40, row 3 (8-11): height 40
    // page budget 100: row1 (40) + gap(10) + row2(40) = 90 fits; + gap(10) + row3(40) = 140 overflows
    const heights = new Array(12).fill(40)
    const pages = paginateBlocks(heights, capacity())
    expect(pages).toEqual([
      [0, 1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11],
    ])
  })

  it('uses a smaller budget for the first page (reserved header space)', () => {
    const heights = new Array(8).fill(40)
    const pages = paginateBlocks(heights, capacity({ firstPageContentHeightPx: 50 }))
    expect(pages).toEqual([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ])
  })

  it('never drops or reorders blocks, and gives an oversized row its own page', () => {
    const heights = [200, 20, 20, 20, 20]
    const pages = paginateBlocks(heights, capacity())
    expect(pages.flat()).toEqual([0, 1, 2, 3, 4])
    expect(pages[0]).toEqual([0, 1, 2, 3])
    expect(pages).toHaveLength(2)
  })

  it('respects the given column count', () => {
    const heights = [10, 10, 10]
    const pages = paginateBlocks(heights, capacity({ columns: 2, firstPageContentHeightPx: 15 }))
    // row1 (0,1) height 10, row2 (2) height 10; budget 15 -> row1 fits alone, row2 overflows -> new page
    expect(pages).toEqual([[0, 1], [2]])
  })
})
