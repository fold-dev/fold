import React, { useState } from 'react'

export const useVisibility = (isVisible: boolean = false) => {
    const [visible, setVisible] = useState(isVisible)

    const delayedShow = (delay: number = 500) => {
        setTimeout(() => setVisible(true), delay)
    }

    return {
        visible,
        delayedShow,
        show: (e?) => setVisible(true),
        hide: (e?) => setVisible(false),
        toggle: (e?) => setVisible(!visible),
    }
}
