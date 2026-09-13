/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { EXERCISE_TYPES } from '@/domain/core'
import { defaultConfigs } from '@/domain/config'
import { buildWorksheetUrl } from '@/domain/url'
import { routes } from '@/app/router'

// jsdom does no real layout, so every measured height is 0 — that's fine, pagination
// just needs *a* consistent number, not a realistic one. observe() fires its callback
// synchronously (real ResizeObserver is async) so the worksheet preview's measurement
// pass resolves before test assertions run.
class ResizeObserverStub {
  #callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.#callback = callback
  }

  observe(target: Element) {
    const rect = { width: 0, height: 0 } as DOMRectReadOnly
    const entry = {
      target,
      contentRect: rect,
      borderBoxSize: [{ inlineSize: 0, blockSize: 0 }],
      contentBoxSize: [{ inlineSize: 0, blockSize: 0 }],
      devicePixelContentBoxSize: [{ inlineSize: 0, blockSize: 0 }],
    } as unknown as ResizeObserverEntry
    this.#callback([entry], this as unknown as ResizeObserver)
  }

  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

function renderAt(path: string) {
  return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
}

function visibleTextMatches(text: string) {
  return screen.getAllByText(text).filter((el) => !el.closest('[data-measurement-probe]'))
}

afterEach(cleanup)

describe.each(EXERCISE_TYPES)('%s page', (type) => {
  it('renders two sheets with a student and an answer version', () => {
    const url = buildWorksheetUrl(defaultConfigs[type], 20260911, 'Weekblad')
    const { container } = renderAt(url)
    expect(container.querySelectorAll('.worksheet-sheet')).toHaveLength(2)
    // Excludes the hidden measurement probe's duplicate; the answer sheet's real
    // header and the sheet-boundary divider label both legitimately say this.
    expect(visibleTextMatches('Antwoordenvel')).toHaveLength(2)
    expect(screen.getAllByText('Weekblad').length).toBeGreaterThanOrEqual(2)
    expect(container.querySelectorAll('.worksheet-block').length).toBeGreaterThan(0)
  })

  it('shows the same sums when the same url is rendered again', () => {
    const url = buildWorksheetUrl(defaultConfigs[type], 777, '')
    const first = renderAt(url).container.textContent
    cleanup()
    const second = renderAt(url).container.textContent
    expect(second).toBe(first)
  })
})

describe('robustness', () => {
  it('loads defaults from a garbage url without crashing', () => {
    renderAt('/sommen/plus?s=abc&pb=-1&res=NaN&tab=99,-3&carry=maybe')
    expect(screen.getByRole('heading', { level: 1, name: /Plus sommen/ })).toBeDefined()
  })

  it('disables generate when no tafel is selected', async () => {
    renderAt('/sommen/tafels?tab=')
    const button = screen.getByRole('button', { name: /Maak oefenblad/ })
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(screen.getByText(/Kies minstens één tafel/)).toBeDefined()
  })

  it('gives the answer sheet bold answers the student sheet does not have', () => {
    const { container } = renderAt(buildWorksheetUrl(defaultConfigs.plus, 4242, ''))
    const sheets = container.querySelectorAll('.worksheet-sheet')
    expect(sheets[0]?.querySelectorAll('strong').length ?? 0).toBe(0)
    expect(sheets[1]?.querySelectorAll('strong').length ?? 0).toBeGreaterThan(0)
  })
})
