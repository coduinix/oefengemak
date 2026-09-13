import { useCallback, useRef, useState } from 'react'

export interface BlockHeights {
  heights: ReadonlyMap<string, number>
  register: (id: string) => (element: HTMLElement | null) => void
}

/** Tracks the real rendered height (border-box) of every registered element by id. */
export function useBlockHeights(): BlockHeights {
  const [heights, setHeights] = useState<ReadonlyMap<string, number>>(new Map())
  const elementsRef = useRef(new Map<Element, string>())

  const observerRef = useRef<ResizeObserver | null>(null)
  if (observerRef.current === null) {
    observerRef.current = new ResizeObserver((entries) => {
      setHeights((previous) => {
        let next: Map<string, number> | null = null
        for (const entry of entries) {
          const id = elementsRef.current.get(entry.target)
          if (id === undefined) continue
          const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
          if (previous.get(id) === height) continue
          next ??= new Map(previous)
          next.set(id, height)
        }
        return next ?? previous
      })
    })
  }

  const register = useCallback(
    (id: string) => (element: HTMLElement | null) => {
      const observer = observerRef.current
      if (observer === null) return
      if (element === null) {
        for (const [el, elId] of elementsRef.current) {
          if (elId === id) {
            observer.unobserve(el)
            elementsRef.current.delete(el)
          }
        }
        return
      }
      elementsRef.current.set(element, id)
      observer.observe(element)
    },
    [],
  )

  return { heights, register }
}
