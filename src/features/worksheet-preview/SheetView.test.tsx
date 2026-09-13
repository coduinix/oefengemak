/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { defaultSplitsen } from '@/domain/config'
import { generateWorksheet } from '@/domain/worksheet'
import { SheetView } from './SheetView'

// jsdom does no real layout. This stub reports a fixed height per element so
// paginateBlocks has something non-trivial to chunk, and fires synchronously
// (real ResizeObserver is async) so measurement resolves before assertions run.
class ResizeObserverStub {
  #callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.#callback = callback
  }

  observe(target: Element) {
    const isPage = target.classList.contains('worksheet-page')
    const height = isPage ? 400 : 100
    const entry = {
      target,
      contentRect: { width: 0, height },
      borderBoxSize: [{ inlineSize: 0, blockSize: height }],
    } as unknown as ResizeObserverEntry
    this.#callback([entry], this as unknown as ResizeObserver)
  }

  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

afterEach(cleanup)

// Excludes the always-mounted, aria-hidden measurement probe, which duplicates
// every page/block for continuous height tracking (see MeasurementProbe).
function visible(container: HTMLElement, selector: string) {
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.closest('[data-measurement-probe]'),
  )
}

const worksheet = generateWorksheet({
  title: 'Test',
  seed: 1,
  sections: [{ config: { ...defaultSplitsen, count: 16, perBlock: 1 } }],
})

describe('SheetView pagination', () => {
  it('splits blocks across multiple .worksheet-page containers with a dotted break between them', () => {
    const { container } = render(<SheetView worksheet={worksheet} mode="student" />)
    const pages = visible(container, '.worksheet-page')
    expect(pages.length).toBeGreaterThan(1)
    expect(visible(container, '.worksheet-page-break')).toHaveLength(pages.length - 1)
    // total blocks preserved across pages, none dropped or duplicated
    const totalBlocks = pages.reduce(
      (sum, page) => sum + page.querySelectorAll('.worksheet-block').length,
      0,
    )
    expect(totalBlocks).toBe(16)
  })

  it('marks .worksheet-page--last only on the answers sheet, on its final page', () => {
    const { container: studentContainer } = render(
      <SheetView worksheet={worksheet} mode="student" />,
    )
    expect(visible(studentContainer, '.worksheet-page--last')).toHaveLength(0)
    cleanup()

    const { container: answersContainer } = render(
      <SheetView worksheet={worksheet} mode="answers" />,
    )
    const pages = visible(answersContainer, '.worksheet-page')
    const last = visible(answersContainer, '.worksheet-page--last')
    expect(last).toHaveLength(1)
    expect(last[0]).toBe(pages[pages.length - 1])
  })
})
