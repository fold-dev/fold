import { useEffect } from 'react'
import { windowObject } from '../helpers'

const scrollKeys: Set<String> = new Set([
    'Enter',
    'Return',
    ' ',
    'PageUp',
    'PageDown',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowUp',
    'ArrowRight',
    'ArrowDown',
])

// https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily/11371279#11371279
export const usePreventScrolling = (shouldPreventScrolling) => {
    useEffect(() => {
        if (!shouldPreventScrolling) return

        const preventDefault = (e: Event) => e.preventDefault()
        const preventDefaultOnScrollKeys = (e: KeyboardEvent) => {
            if (scrollKeys.has(e.key)) e.preventDefault()
            return false
        }

        let supportsPassive = false

        try {
            const options = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true
                },
            })

            windowObject.addEventListener('testPassiveIsSupported', null as any, options)
            windowObject.removeEventListener('testPassiveIsSupported', null as any, options)
        } catch (e) {}

        let wheelOpt = supportsPassive ? { passive: false } : false
        let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

        function preventScroll() {
            windowObject.addEventListener('DOMMouseScroll', preventDefault, false)
            windowObject.addEventListener(wheelEvent, preventDefault, wheelOpt)
            windowObject.addEventListener('touchmove', preventDefault, wheelOpt)
            windowObject.addEventListener('keydown', preventDefaultOnScrollKeys, false)
        }

        function enableScroll() {
            windowObject.removeEventListener('DOMMouseScroll', preventDefault, false)
            windowObject.removeEventListener(wheelEvent, preventDefault, wheelOpt as any)
            windowObject.removeEventListener('touchmove', preventDefault, wheelOpt as any)
            windowObject.removeEventListener('keydown', preventDefaultOnScrollKeys, false)
        }

        if (shouldPreventScrolling) preventScroll()

        return () => enableScroll()
    }, [shouldPreventScrolling])
}
