import React, { useState } from 'react'

export const useDragging = (isDragging: boolean = false) => {
    const [dragging, setDragging] = useState(isDragging)

    return {
        dragging,
        startDragging: () => setDragging(true),
        stopDragging: () => setDragging(false),
    }
}
