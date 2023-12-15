import { useLayoutEffect, useRef, useState } from 'react'

export function useHasScroll<ElementType extends HTMLElement>() {
  const ref = useRef<ElementType | null>(null)

  const [hasScroll, setHasScroll] = useState(false)

  useLayoutEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setHasScroll(Math.round(entry.target.scrollWidth) > Math.round(entry.target.clientWidth))
      }
    })

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  return { ref, hasScroll }
}
