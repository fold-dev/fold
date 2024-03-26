import { documentObject, windowObject } from '../helpers'
import React, { useEffect } from 'react'

export type DragEventName = 'ondrop' | 'onstart' | 'onend' | 'outdent' | 'indent'

export const dispatchDragEvent = (eventName: DragEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent(eventName, { detail: data }))

export const useDragEvent = (event: DragEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler)
    })
}
