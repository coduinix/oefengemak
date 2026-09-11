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

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

function renderAt(path: string) {
  return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
}

afterEach(cleanup)

describe.each(EXERCISE_TYPES)('%s page', (type) => {
  it('renders two sheets with a student and an answer version', () => {
    const url = buildWorksheetUrl(defaultConfigs[type], 20260911, 'Weekblad')
    const { container } = renderAt(url)
    expect(container.querySelectorAll('.worksheet-sheet')).toHaveLength(2)
    expect(screen.getAllByText('Antwoordenvel')).toHaveLength(1)
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
