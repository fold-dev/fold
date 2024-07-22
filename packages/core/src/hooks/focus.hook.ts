import { useEffect, useRef } from 'react'
import { documentObject, getKey } from '../helpers'
import { CoreViewProps } from '../types'

export const FOCUSABLE = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
]

export type FocusTrapProps = {
    focusable?: string[]
    onEscape?: any
} & CoreViewProps

export const useFocus = (focusable = FOCUSABLE, arrowNavigation = false) => {
    const containerRef = useRef(null)
    const focusableEls = useRef(null)
    const firstFocusableEl = useRef(null)
    const lastFocusableEl = useRef(null)
    const shouldPreventScroll = useRef(false)

    const handleKeyDown = (e) => {
        let flag = false
        const { isUp, isDown, isTabNormal, isTabReverse, isTab, isShift } = getKey(e)
        const elements: any[] = Array.from(focusableEls.current)
        const preventScroll = !!shouldPreventScroll.current

        if (isTab) {
            if (isShift && documentObject.activeElement === firstFocusableEl.current) {
                e.preventDefault()
                lastFocusableEl.current?.focus({ preventScroll })
            }

            if (!isShift && documentObject.activeElement === lastFocusableEl.current) {
                e.preventDefault()
                firstFocusableEl.current?.focus({ preventScroll })
            }
        }
    }

    const trapFocus = (el, preventScroll = false) => {
        shouldPreventScroll.current = preventScroll
        containerRef.current = el
        focusableEls.current = containerRef.current.querySelectorAll(focusable.join(','))
        lastFocusableEl.current = focusableEls.current[focusableEls.current.length - 1]
        firstFocusableEl.current = focusableEls.current[0]
        firstFocusableEl.current?.focus({ preventScroll })
        containerRef.current.addEventListener('keydown', handleKeyDown)
    }

    useEffect(() => {
        return () => containerRef.current?.removeEventListener('keydown', handleKeyDown)
    }, [])

    return { trapFocus }
}
