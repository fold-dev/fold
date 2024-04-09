import { documentObject, windowObject } from '../helpers'
import React, { useEffect } from 'react'

export type DragEventName = 'ondrop' | 'onstart' | 'onend' | 'outdent' | 'indent'

export const dispatchDragEvent = (eventName: DragEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent('drag-' + eventName, { detail: data }))

export const useDragEvent = (eventName: DragEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener('drag-' + eventName, handler, passive)
        return () => documentObject.removeEventListener('drag-' + eventName, handler)
    })
}
