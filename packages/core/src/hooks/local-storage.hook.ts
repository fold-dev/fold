import { useState, useEffect } from 'react'

export const useLocalStorage = (key: string, initialValue: any) => {
    const [value, setValue] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key)
            return storedValue ? JSON.parse(storedValue) : initialValue
        } catch (error) {
            console.error('Error reading localStorage key', key, error)
            return initialValue
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Error setting localStorage key', key, error)
        }
    }, [key, value])

    return [value, setValue] as const
}
