import React, { useState } from 'react'

/**
 * Not documented - appears not be used
 */

export const useToggle = (isOn: boolean = false) => {
    const [on, setOn] = useState(isOn)

    return {
        on,
        turnOn: () => setOn(true),
        turnOff: () => setOn(false),
        toggle: () => setOn(!on),
    }
}
