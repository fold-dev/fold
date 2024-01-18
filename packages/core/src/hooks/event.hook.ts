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

// editor

export type EditorEventName = 'emoticon' | 'node'

export const dispatchEditorEvent = (eventName: EditorEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent(eventName, { detail: data }))

export const useEditorEvent = (event: EditorEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler)
    })
}

// drag

export type DragEventName = 'ondrop' | 'onstart' | 'onend'

export const dispatchDragEvent = (eventName: DragEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent(eventName, { detail: data }))

export const useDragEvent = (event: DragEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler)
    })
}

// kanban

export type KanbanEventName = 'columnvisible' | 'addcard' | 'addcolumn' | 'updateswimlane' | 'updatecolumn'

export const dispatchKanbanEvent = (eventName: KanbanEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent(eventName, { detail: data }))

export const useKanbanEvent = (event: KanbanEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler)
    })
}

// todo

export type TodoEventName = 'sectionvisible' | 'addtask' | 'addsection' | 'updatesection'

export const dispatchTodoEvent = (eventName: TodoEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent(eventName, { detail: data }))

export const useTodoEvent = (event: TodoEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler)
    })
}

// data-grid

export type DataGridEventName = 'row-selection' | 'clear-row-selection' | 'celledit' | 'celldelete'

export const dispatchDataGridEvent = (eventName: DataGridEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent(eventName, { detail: data }))

export const useDataGridEvent = (event: DataGridEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener(event, handler, passive)
        return () => documentObject.removeEventListener(event, handler)
    })
}
