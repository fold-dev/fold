import { useEffect, useState } from 'react'

export const useInput = (defaultValue: any) => {
    const [value, setValue] = useState<any>(defaultValue)

    return {
        value,
        setValue,
        onChange: (e) => setValue(e.target.value),
    }
}
