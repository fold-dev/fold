import React, { useRef } from 'react'

export const useTimer = () => {
    const timeoutRef = useRef(null)

    const setTimer = (cb: any, delay: number) => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            cb()
        }, delay)
    }

    const clearTimer = () => {
        clearTimeout(timeoutRef.current)
    }

    return { setTimer, clearTimer }
}
