import { documentObject, windowObject } from '../helpers'
import React, { useEffect } from 'react'

export const useEvent = (event, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler, passive)
    })
}

export const useWindowEvent = (event, handler, passive = false) => {
    useEffect(() => {
        windowObject.addEventListener(event, handler, passive)
        return () => windowObject.removeEventListener(event, handler, passive)
    })
}

export const useElementEvent = (node, event, handler, passive = false) => {
    useEffect(() => {
        node?.addEventListener(event, handler, passive)
        return () => node?.removeEventListener(event, handler, passive)
    })
}

export const dispatchCustomEvent = (eventName: string, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent(eventName, { detail: data }))

export const useCustomEvent = (event: string, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler)
    })
}
