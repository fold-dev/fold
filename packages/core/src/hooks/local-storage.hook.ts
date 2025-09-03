import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key)
            return stored ? JSON.parse(stored) : initialValue
        } catch {
            return initialValue
        }
    })

    // when key changes, reset value (don’t carry over old one)
    useEffect(() => {
        try {
            const stored = localStorage.getItem(key)
            setValue(stored ? JSON.parse(stored) : initialValue)
        } catch {
            setValue(initialValue)
        }
    }, [key, initialValue])

    // persist whenever *value* changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {}
    }, [key, value])

    return [value, setValue] as const
}
