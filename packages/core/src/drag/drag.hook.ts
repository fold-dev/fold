import {
    useEffect,
    useRef
} from 'react'
import {
    dispatchDragEvent,
    documentObject,
    FOLD_DRAG_CACHE,
    FOLD_DRAG_COUNT,
    FOLD_DRAG_STATE,
    getBoundingClientRect,
    globalCursor,
    positionDOMElement,
    resizeDOMElement,
    setOrigin,
    setTarget
} from '../'
import { getButton, waitForRender, windowObject } from '../helpers'

export const useDrag = (args: any = { indentDelay: 100 }) => {
    const ghostRef = useRef(null)
    const { indentDelay } = args

    const setCount = (count: number) => {
        windowObject[FOLD_DRAG_COUNT] = count
    }

    const getStaticState = (): any => windowObject[FOLD_DRAG_STATE]

    const getCache = (): any => windowObject[FOLD_DRAG_CACHE]

    const getGhostElement = () => ghostRef.current

    const setGhostElement = (html: string = null) => (ghostRef.current.innerHTML = html)

    const startDrag = () => {
        documentObject.body.dataset.dragging = 'yes'
        globalCursor.add('grabbing')
        dispatchDragEvent('onstart', null)
    }

    const endDrag = () => {
        delete documentObject.body.dataset.dragging
        globalCursor.remove('grabbing')
        dispatchDragEvent('onend', null)
    }

    const updateTargetIndent = (indentLevel) => {
        const { target } = getStaticState()
        const cache = getCache()
        cache.indent = { ...cache.indent, indent: indentLevel }
        setTarget({ ...target, indent: indentLevel })
        waitForRender(() => (cache.indentLock = false), indentDelay)
    }

    const outdent = () => {
        const cache = getCache()

        if (cache.indentLock) return
        cache.indentLock = true

        const { index, indent, areaId, previous, previousIndent, next, nextIndent } = cache.indent

        // calculate max outdent level
        const maximumOutdent = next ? nextIndent : 0

        // calculate next outdent level
        const targetOutdent = indent > maximumOutdent ? indent - 1 : maximumOutdent

        updateTargetIndent(targetOutdent)
    }

    const indent = () => {
        const cache = getCache()

        if (cache.indentLock) return
        cache.indentLock = true

        const { index, indent, areaId, previous, previousIndent, next, nextIndent } = cache.indent

        // calculate max indent level
        const maximumIndent = previous ? (previousIndent < nextIndent ? nextIndent : previousIndent + 1) : indent

        // calculate next indent level
        const targetIndent = indent < maximumIndent ? indent + 1 : maximumIndent

        updateTargetIndent(targetIndent)
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
        const finalTargetVariant = JSON.parse(parent.dataset.targetvariant)
        const isHorizontal = direction == 'horizontal'
        const isVertical = direction == 'vertical'
        const index = +el.dataset.index
        const noDrag = !!el.dataset.nodrag
        const noDrop = !!el.dataset.nodrop

        if (!noDrag && isLeftButton) {
            e.stopPropagation()

            cache.mouseDown = true

            setTimeout(() => {
                if (cache.mouseDown) {
                    const { width, height, left, top } = getBoundingClientRect(el)
                    const mouseOffsetLeft = mouseLeft - left
                    const mouseOffsetTop = mouseTop - top
                    const x = mouseLeft - mouseOffsetLeft
                    const y = mouseTop - mouseOffsetTop
                    const newNode = el.cloneNode(true)
                    const indent = el.dataset.indent ? +el.dataset.indent : 0
                    const elementId = el.dataset.id
                    const ghost = getGhostElement()

                    // set the contents
                    setGhostElement(newNode.outerHTML)

                    // make sure the new node + ghost element are the same size
                    resizeDOMElement(width, height, newNode)
                    resizeDOMElement(width, height, ghost)

                    // for indentation (and other margine)
                    ghost.firstChild.style.margin = '0px'

                    // set the intial ghost position (based on the current x/y)
                    // again - synced for performance in the UI
                    positionDOMElement(x, y, 0, ghost, () => {
                        cache.targetElement = el
                        cache.mouse = { x: mouseLeft, y: mouseTop }
                        cache.originMouse = {
                            left: mouseLeft,
                            top: mouseTop,
                            offsetLeft: mouseOffsetLeft,
                            offsetTop: mouseOffsetTop,
                        }

                        // save the cache for the reset 
                        cache.targetCache = {
                            focus: false,
                            moveDirection: isVertical ? 'up' : 'left',
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
                            moveDirection: isVertical ? 'up' : 'left',
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

    useEffect(() => {
        ghostRef.current = documentObject.getElementById('f-drag-ghost')
    }, [])

    return {
        setCount,
        getStaticState,
        getCache,
        getGhostElement,
        setGhostElement,
        startDrag,
        endDrag,
        outdent,
        indent,
        onMouseDown,
        onMouseUp,
    }
}
