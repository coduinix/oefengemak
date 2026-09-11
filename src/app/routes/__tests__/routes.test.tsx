/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { defaultConfigs } from '@/domain/config'
import { buildWorksheetUrl } from '@/domain/url'
import { routes } from '@/app/router'

// Radix's radio and checkbox measure themselves; jsdom has no ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

afterEach(cleanup)

describe('routes', () => {
  it('renders the landing page', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /Gratis oefenbladen/ })).toBeDefined()
  })

  it('renders the about page', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { level: 1, name: /Over Oefengemak/ })).toBeDefined()
  })

  it('renders the doneren page', () => {
    renderAt('/doneren')
    expect(screen.getByRole('heading', { level: 1, name: /Steun Oefengemak/ })).toBeDefined()
  })

  it('renders a 404 for an unknown path', () => {
    renderAt('/geen-idee')
    expect(screen.getByRole('heading', { level: 1, name: /niet gevonden/ })).toBeDefined()
  })

  it('renders a 404 for an unknown exercise type', () => {
    renderAt('/sommen/kwadraten')
    expect(screen.getByRole('heading', { level: 1, name: /niet gevonden/ })).toBeDefined()
  })

  it('renders the empty exercise page without a seed', () => {
    renderAt('/sommen/plus')
    expect(screen.getByRole('heading', { level: 1, name: /Plus sommen/ })).toBeDefined()
    expect(screen.queryAllByTestId('exercise-row')).toHaveLength(0)
  })

  it('renders exercises for a seeded worksheet url', () => {
    renderAt(buildWorksheetUrl(defaultConfigs.plus, 12345, 'Test'))
    expect(screen.getAllByTestId('exercise-row').length).toBeGreaterThan(0)
  })
})
