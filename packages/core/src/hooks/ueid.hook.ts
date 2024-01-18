import { useMemo } from 'react'
import { generateUEID } from '../helpers'

export const useId = (defaultId: string = null) => {
    const id = useMemo(() => defaultId || generateUEID(), [])
    return id
}
