import React, { useState } from 'react'

/**
 * Not documented and is in dev
 */

export const useTouch = ({ minSwipeDistance, onSwipedLeft, onSwipedRight }) => {
    const [touchDown, setTouchDown] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    const onTouchStart = (e) => {
        const isTouch = e.targetTouches
        const start = isTouch ? e.targetTouches[0].clientX : e.clientX

        setTouchEnd(0)
        setTouchStart(start)
        setTouchDown(true)
    }

    const onTouchMove = (e) => {
        if (!touchDown) return

        const isTouch = e.targetTouches
        const end = isTouch ? e.targetTouches[0].clientX : e.clientX

        setTouchEnd(end)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) onSwipedLeft()
        if (isRightSwipe) onSwipedRight()

        setTouchDown(true)
    }

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    }
}
