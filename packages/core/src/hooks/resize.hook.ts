import { useLayoutEffect, useState } from 'react'

/**
 * Not documented - appears experimental
 */

export const useResize = (el: HTMLElement) => {
    const [box, setBox] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

    const observe = (e) => {
        setBox({
            width: el?.offsetWidth,
            height: el?.offsetHeight,
        })
    }

    useLayoutEffect(() => {
        if (!el) return

        const observer = new ResizeObserver(observe)
        observer.observe(el)

        return () => observer.disconnect()
    }, [el])

    return box
}
