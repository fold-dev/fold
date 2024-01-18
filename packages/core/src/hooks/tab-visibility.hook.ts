import { useEvent } from './event.hook'

export function useTabVisibility(cb: any) {
    useEvent('visibilitychange', cb)
}
