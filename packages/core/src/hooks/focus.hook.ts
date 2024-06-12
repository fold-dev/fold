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
    '[contenteditable]'
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

    const handleKeyDown = (e) => {
        let flag = false
        const { isUp, isDown, isTabNormal, isTabReverse, isTab } = getKey(e)
        const elements: any[] = Array.from(focusableEls.current)

        if (isTab) {
            if (e.shiftKey && documentObject.activeElement === firstFocusableEl.current) {
                e.preventDefault()
                lastFocusableEl.current?.focus()
            } else if (!e.shiftKey && documentObject.activeElement === lastFocusableEl.current) {
                e.preventDefault()
                firstFocusableEl.current?.focus()
            }
        }
    }

    const trapFocus = (el) => {
        containerRef.current = el
        focusableEls.current = containerRef.current.querySelectorAll(focusable.join(','))
        lastFocusableEl.current = focusableEls.current[focusableEls.current.length - 1]
        firstFocusableEl.current = focusableEls.current[0]
        firstFocusableEl.current?.focus()
        containerRef.current.addEventListener('keydown', handleKeyDown)
    }

    useEffect(() => {
        return () => containerRef.current?.removeEventListener('keydown', handleKeyDown)
    }, [])

    return { trapFocus }
}
