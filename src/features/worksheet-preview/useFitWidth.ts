import { useCallback, useRef, useState } from 'react'

const MIN_SCALE = 0.55

export interface FitWidth {
  ref: (element: HTMLElement | null) => void
  scale: number
}

/**
 * Reports how much to scale a `naturalWidthPx`-wide element down so it fits the
 * width of the returned ref's element, like a document viewer. Never scales up,
 * and never scales below MIN_SCALE — past that point the caller should let the
 * content overflow and scroll horizontally instead of shrinking text further.
 */
export function useFitWidth(naturalWidthPx: number): FitWidth {
  const [containerWidthPx, setContainerWidthPx] = useState<number | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)

  const ref = useCallback((element: HTMLElement | null) => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (element === null) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry === undefined) return
      setContainerWidthPx(entry.contentRect.width)
    })
    observer.observe(element)
    observerRef.current = observer
  }, [])

  const scale =
    containerWidthPx === null
      ? 1
      : Math.max(Math.min(1, containerWidthPx / naturalWidthPx), MIN_SCALE)

  return { ref, scale }
}
