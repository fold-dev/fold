import { useState } from 'react'
import { windowObject } from '../helpers'
import { useWindowEvent } from './event.hook'

export const getWindowDimensions = () => {
    const { innerWidth, innerHeight, outerWidth, outerHeight } = windowObject

    // not very accurate - don't trust 100%
    const zoom = ((outerWidth - 10) / innerWidth) * 100

    return {
        width: innerWidth,
        height: innerHeight,
        zoom,
    }
}

export function useWindowResize() {
    const [dimensions, setDimensions] = useState(getWindowDimensions())
    useWindowEvent('resize', (e) => setDimensions(getWindowDimensions()))
    return dimensions
}
