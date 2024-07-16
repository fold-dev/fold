import { useState } from 'react'

export const useCheck = (isChecked: boolean = false) => {
    const [checked, setChecked] = useState(isChecked)

    return {
        checked,
        setChecked,
        check: () => {
            setChecked(!checked)
        },
    }
}
