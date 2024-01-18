import React, { useState } from 'react'

export const useVisibility = (isVisible: boolean = false) => {
    const [visible, setVisible] = useState(isVisible)

    const delayedShow = (delay: number = 500) => {
        setTimeout(() => setVisible(true), delay)
    }

    return {
        visible,
        delayedShow,
        show: (e?) => {
            if (e) {
                e.preventDefault()
                e.stopPropagation()
            }
            setVisible(true)
        },
        hide: (e?) => {
            if (e) {
                e.preventDefault()
                e.stopPropagation()
            }
            setVisible(false)
        },
        toggle: (e?) => {
            if (e) {
                e.preventDefault()
                e.stopPropagation()
            }
            setVisible(!visible)
        },
    }
}
