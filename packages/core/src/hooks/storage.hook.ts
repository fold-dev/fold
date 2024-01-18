import { replaceAll } from '../helpers'

export function useStorage() {
    return {
        setStorage: (name: string, val: string = 'true'): void => {
            localStorage.setItem(name, val)
        },
        getStorage: (name: string): string => {
            return localStorage.getItem(name)
        },
        getSafeStorage: (name: string): string => {
            return localStorage.getItem(name) || ''
        },
        deleteStorage: (name: string): void => {
            localStorage.removeItem(name)
        },
    }
}

export function useCacheValue(namespace: string) {
    // spaceValue is used to auto add a space to any saved value
    // this is so that joined cached values can't form a unintended value

    const getValue = (value: string) => value + ' '

    const isCached = (value: string) => {
        return getSafeCache().includes(getValue(value))
    }

    const deleteCache = (value: string) => {
        localStorage.setItem(namespace, replaceAll(getSafeCache(), getValue(value), ''))
    }

    const getSafeCache = () => {
        return localStorage.getItem(namespace) || ''
    }

    const setCache = (value: string) => {
        localStorage.setItem(namespace, getValue(value) + getSafeCache())
    }

    return {
        isCached,
        deleteCache,
        getSafeCache,
        setCache,
    }
}
