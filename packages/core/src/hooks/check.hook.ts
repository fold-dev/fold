import { useState } from 'react'

export const useCheck = (isChecked: boolean = false) => {
    const [checked, setChecked] = useState(isChecked)

    return {
        checked,
        check: () => {
            setChecked(!checked)
        },
    }
}
