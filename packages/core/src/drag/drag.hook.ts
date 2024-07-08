import { useEffect, useRef } from 'react'
import {
    dispatchDragEvent,
    documentObject,
    FOLD_DRAG_CACHE,
    FOLD_DRAG_STATE,
    getBoundingClientRect,
    getPreviousNextElements,
    globalCursor,
    positionDOMElement,
    resizeDOMElement,
    setOrigin,
    setTarget,
} from '../'
import { getButton, waitForRender, windowObject } from '../helpers'

export const FOLD_CUSTOM_GHOST_ELEMENT = 'FOLD_CUSTOM_GHOST_ELEMENT'
export const FOLD_GHOST_ELEMENT_ROTATION = 'FOLD_GHOST_ELEMENT_ROTATION'

export const useDrag = (args: any = { indentDelay: 100 }) => {
    const ghostRef = useRef(null)
    const { indentDelay } = args

    const getStaticState = (): any => windowObject[FOLD_DRAG_STATE]

    const getCache = (): any => windowObject[FOLD_DRAG_CACHE]

    const getGhostElement = () => ghostRef.current

    const setGhostElement = (html: string = null) => {
        ghostRef.current.innerHTML = html
    }

    const setCustomGhostElement = (html: string = null) => {
        windowObject[FOLD_CUSTOM_GHOST_ELEMENT] = true
        setGhostElement(html)
    }

    const setCustomGhostElementRotation = (rotation: string = '2deg') => {
        windowObject[FOLD_GHOST_ELEMENT_ROTATION] = rotation
    }

    const clearGhostElement = () => {
        windowObject[FOLD_GHOST_ELEMENT_ROTATION] = null
        windowObject[FOLD_CUSTOM_GHOST_ELEMENT] = undefined
        setGhostElement('')
    }

    const hasCustomGhostElement = () => {
        return !!windowObject[FOLD_CUSTOM_GHOST_ELEMENT]
    }

    const startDrag = () => {
        documentObject.body.dataset.dragging = 'yes'
        globalCursor.add('grabbing')
        dispatchDragEvent('onstart', null)
    }

    const endDrag = () => {
        const cache = getCache()
        delete documentObject.body.dataset.dragging
        clearGhostElement()
        globalCursor.remove('grabbing')
        dispatchDragEvent('onend', null)
        setTarget({})
        setOrigin({ targetVariant: {} })
        cache.mouseDown = false
    }

    const updateTargetIndent = (indentLevel) => {
        const { target } = getStaticState()
        const cache = getCache()
        cache.indent = { ...cache.indent, indent: indentLevel }
        setTarget({ ...target, indent: indentLevel })
        waitForRender(() => (cache.indentLock = false), indentDelay)
    }

    const getNextIndent = ({ indent, previous, previousIndent, next, nextIndent }) => {
        if (nextIndent - previousIndent >= 2) return indent
        const maximumIndent = previous ? (previousIndent < nextIndent ? nextIndent : previousIndent + 1) : indent
        const targetIndent = indent < maximumIndent ? indent + 1 : maximumIndent
        return targetIndent
    }

    const getNextOutdent = ({ indent, previous, previousIndent, next, nextIndent }) => {
        if (nextIndent - previousIndent >= 2) return indent
        const maximumOutdent = next ? nextIndent : 0
        const targetOutdent = indent > maximumOutdent ? indent - 1 : maximumOutdent
        return targetOutdent
    }

    const outdent = () => {
        const cache = getCache()
        if (cache.indentLock) return
        cache.indentLock = true
        const { index, indent, areaId, previous, previousIndent, next, nextIndent } = cache.indent
        updateTargetIndent(getNextOutdent({ indent, previous, previousIndent, next, nextIndent }))
    }

    const indent = () => {
        const cache = getCache()
        if (cache.indentLock) return
        cache.indentLock = true
        const { index, indent, areaId, previous, previousIndent, next, nextIndent } = cache.indent
        updateTargetIndent(getNextIndent({ indent, previous, previousIndent, next, nextIndent }))
    }

    const onMouseUp = (e: any) => {
        const cache = getCache()
        cache.mouseDown = false
    }

    const onMouseDown = (e: any) => {
        const cache = getCache()
        const { isLeftButton } = getButton(e)
        const mouseLeft = e.clientX
        const mouseTop = e.clientY
        const el = e.currentTarget
        const parent = el.parentElement
        const areaId = parent.getAttribute('id')
        const group = parent.dataset.group
        const direction = parent.dataset.direction
        const finalTargetVariant = parent.dataset.targetvariant ? JSON.parse(parent.dataset.targetvariant) : {}
        const isHorizontal = direction == 'horizontal'
        const isVertical = direction == 'vertical'
        const moveDirection = isVertical ? 'up' : 'left'
        const index = +el.dataset.index
        const noDrag = !!el.dataset.nodrag
        const noDrop = !!el.dataset.nodrop

        if (!noDrag && isLeftButton) {
            e.stopPropagation()

            cache.mouseDown = true

            setTimeout(() => {
                if (cache.mouseDown) {
                    const customGhost = hasCustomGhostElement()
                    const { width, height, left, top } = getBoundingClientRect(el)
                    const mouseOffsetLeft = customGhost ? 0 : mouseLeft - left
                    const mouseOffsetTop = customGhost ? 0 : mouseTop - top
                    const x = mouseLeft - mouseOffsetLeft
                    const y = mouseTop - mouseOffsetTop
                    const newNode = el.cloneNode(true)
                    const indent = el.dataset.indent ? +el.dataset.indent : 0
                    const elementId = el.dataset.id
                    const ghost = getGhostElement()

                    // set the contents
                    if (!customGhost) setGhostElement(newNode.outerHTML)

                    // make sure the new node + ghost element are the same size
                    resizeDOMElement(width, height, newNode)
                    resizeDOMElement(width, height, ghost)

                    // for indentation (and other margine)
                    if (!customGhost) ghost.firstChild.style.margin = '0px'

                    // set the intial ghost position (based on the current x/y)
                    // again - synced for performance in the UI
                    positionDOMElement(x, y, ghost, () => {
                        cache.targetElement = el
                        cache.mouse = { x: mouseLeft, y: mouseTop }
                        cache.originMouse = {
                            left: mouseLeft,
                            top: mouseTop,
                            offsetLeft: mouseOffsetLeft,
                            offsetTop: mouseOffsetTop,
                        }

                        // cache the indentation parameters
                        let targetIndent = indent
                        const previous = el.previousSibling
                        const next = el.nextSibling
                        const previousIndent = previous ? +previous.dataset.indent : 0
                        const nextIndent = next ? +next.dataset.indent : 0

                        if (nextIndent > previousIndent) targetIndent = nextIndent

                        cache.indent = {
                            index,
                            indent: targetIndent,
                            areaId,
                            previous,
                            previousIndent,
                            next,
                            nextIndent,
                        }

                        // outline the previous & next elements
                        // for (let target of el.parentNode.children) target.style.border = 'none'
                        // if (previous) previous.style.border = '0.2rem solid crimson'
                        // if (next) next.style.border = '0.2rem solid darkcyan'

                        // save the cache for the reset
                        cache.targetCache = {
                            focus: false,
                            moveDirection,
                            index,
                            indent,
                            left: el.offsetLeft,
                            top: el.offsetTop,
                            height,
                            width,
                            areaId,
                            elementId,
                            group,
                        }

                        setOrigin({
                            targetVariant: finalTargetVariant,
                            elementId,
                            width,
                            height,
                            areaId,
                            index,
                            group,
                        })

                        setTarget({
                            focus: false,
                            moveDirection,
                            index,
                            indent,
                            left: el.offsetLeft,
                            top: el.offsetTop,
                            height,
                            width,
                            areaId,
                            elementId,
                            group,
                        })

                        startDrag()
                    })
                }
            }, 150)
        }
    }

    const lockDrag = () => {
        const cache = getCache()
        cache.locked = true
    }

    const unlockDrag = () => {
        const cache = getCache()
        cache.locked = false
    }

    useEffect(() => {
        ghostRef.current = documentObject.getElementById('f-drag-ghost')
    }, [])

    return {
        getStaticState,
        getCache,
        getGhostElement,
        setGhostElement,
        setCustomGhostElementRotation,
        clearGhostElement,
        hasCustomGhostElement,
        setCustomGhostElement,
        startDrag,
        endDrag,
        getNextOutdent,
        outdent,
        getNextIndent,
        indent,
        onMouseDown,
        onMouseUp,
        lockDrag,
        unlockDrag,
    }
}
