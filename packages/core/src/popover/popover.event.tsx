import { documentObject, windowObject } from '../helpers'
import React, { useEffect } from 'react'

export type PopoverEventName = 'ondismiss'

export const dispatchPopoverEvent = (eventName: PopoverEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent('popover-' + eventName, { detail: data }))

export const usePopoverEvent = (eventName: PopoverEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener('popover-' + eventName, handler, passive)
        return () => documentObject.removeEventListener('popover-' + eventName, handler)
    })
}
