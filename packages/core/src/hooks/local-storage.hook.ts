import { useEffect, useRef, useState } from 'react'

// Read a value from localStorage. When `storageKey` is provided the value is
// read from a namespaced object stored under `storageKey` (using `key` as the
// property name). Otherwise it falls back to a straight read at `key`.
export function getStorageItem<T>(key: string, initialValue: T, storageKey?: string): T {
    try {
        if (storageKey) {
            const raw = localStorage.getItem(storageKey)
            const obj = raw ? JSON.parse(raw) : {}
            return key in obj ? obj[key] : initialValue
        }
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : initialValue
    } catch {
        return initialValue
    }
}

// Write a value to localStorage. When `storageKey` is provided the value is
// stored as a property on the namespaced object at `storageKey`. Otherwise it
// is written straight to `key`.
export function setStorageItem<T>(key: string, value: T, storageKey?: string): void {
    try {
        if (storageKey) {
            const raw = localStorage.getItem(storageKey)
            const obj = raw ? JSON.parse(raw) : {}
            obj[key] = value
            localStorage.setItem(storageKey, JSON.stringify(obj))
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
    } catch {}
}

// Remove a value from localStorage. When `storageKey` is provided the property
// `key` is removed from the namespaced object (and the object itself is removed
// when it becomes empty). Otherwise the straight `key` is removed.
export function removeStorageItem(key: string, storageKey?: string): void {
    try {
        if (storageKey) {
            const raw = localStorage.getItem(storageKey)
            if (!raw) return
            const obj = JSON.parse(raw)
            delete obj[key]
            if (Object.keys(obj).length) localStorage.setItem(storageKey, JSON.stringify(obj))
            else localStorage.removeItem(storageKey)
        } else {
            localStorage.removeItem(key)
        }
    } catch {}
}

export function useLocalStorage<T>(key: string, initialValue: T, storageKey?: string) {
    const keyCache = useRef(null)
    const [value, setValue] = useState<T>(() => getStorageItem(key, initialValue, storageKey))

    // when key changes, reset value (don’t carry over old one)
    useEffect(() => {
        const keyIsDifferent = keyCache.current != key

        // if key is not different return
        if (!keyIsDifferent) return
        setValue(getStorageItem(key, initialValue, storageKey))
        keyCache.current = key
    }, [key, initialValue, storageKey])

    // persist whenever *value* changes
    useEffect(() => {
        setStorageItem(key, value, storageKey)
    }, [key, value, storageKey])

    return [value, setValue] as const
}
