import { useEffect, useState } from 'react'
import { useWindowEvent } from './event.hook'

export const useConnection = (cb) => {
    const [online, setOnline] = useState(true)
    const handleOnline = () => {
        if (!online) {
            cb('restored')
        } else {
            cb('online')
        }
        setOnline(true)
    }
    const handleOffline = () => {
        cb('offline')
        setOnline(false)
    }
    useWindowEvent('online', handleOnline)
    useWindowEvent('offline', handleOffline)
    return { online }
}
