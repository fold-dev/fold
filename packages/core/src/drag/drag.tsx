import { element } from 'prop-types'
import React, {
    Children,
    cloneElement,
    forwardRef,
    ReactElement,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    classNames,
    CoreViewProps,
    dispatchDragEvent,
    dispatchPubsub,
    documentObject,
    executeLast,
    getBoundingClientRect,
    getKey,
    globalCursor,
    mergeRefs,
    positionDOMElement,
    PubsubService,
    renderChildren,
    resizeDOMElement,
    useDragEvent,
    useId,
    usePubsub,
    useWindowEvent,
    View,
} from '../'
import { getButton, waitForRender, windowObject } from '../helpers'

export type MoveDirection = 'up' | 'down' | 'right' | 'left'

export type DragVariant = 'lined' | 'lined-focus' | 'focus' | 'animated'

export type DragOrigin = {
    elementId: string
    targetVariant: any
    height: number
    width: number
    areaId: string
    index: number
    group: string
}

export type DragTarget = {
    focus: boolean
    moveDirection: MoveDirection
    index: number
    indent: number
    left: number
    top: number
    height: number
    width: number
    areaId: string
    elementId: string
    group: string
}

export const FOLD_DRAG_CACHE = 'FOLD_DRAG_CACHE'
export const FOLD_DRAG_STATE = 'FOLD_DRAG_STATE'

windowObject[FOLD_DRAG_CACHE] = {
    mouseDown: false,
    init: {},
    originMouse: {},
    mouse: { x: 0, y: 0 },
    time: 0,
    moveDirection: null,
    targetElement: null,
    targetAreaId: null,
    indent: {},
    targetCache: {},
}

windowObject[FOLD_DRAG_STATE] = {
    target: {},
    origin: { targetVariant: {} },
}

export const setDragState = (data) => {
    const { namespace, ...rest } = data
    windowObject[FOLD_DRAG_STATE] = { ...windowObject[FOLD_DRAG_STATE], ...rest }
    dispatchPubsub('state-' + namespace, data)
}

export const setTarget = (target: Partial<DragTarget>) => setDragState({ namespace: 'target', target })

export const setOrigin = (origin: Partial<DragOrigin>) => setDragState({ namespace: 'origin', origin })

export const getDragState = (namespace: string): any => {
    const [_, render] = useState(new Date())
    usePubsub('state-' + namespace, (data: any) => render(new Date()))
    return windowObject[FOLD_DRAG_STATE]
}

/* 

export const setDragState = (data) => {
    const { namespace, ...rest } = data
    windowObject[FOLD_DRAG_STATE] = { ...windowObject[FOLD_DRAG_STATE], ...rest }
    windowObject.dispatchEvent(new CustomEvent(namespace, { detail: data }))
}

export const setTarget = (target: Partial<DragTarget>) => {
    setDragState({ namespace: 'target', target })
}

export const setOrigin = (origin: Partial<DragOrigin>) => {
    setDragState({ namespace: 'origin', origin })
}

export const getDragState = (namespace: string): any => {
    const [_, render] = useState(new Date())
    const handler = (data) => render(new Date())
    useWindowEvent(namespace, handler)
    return { ...windowObject[FOLD_DRAG_STATE], _ }
}

*/

export const getPreviousNextElements = (targetIndex, targetElement, moveDirection) => {
    const { origin } = windowObject[FOLD_DRAG_STATE]
    const originIndex = origin.index
    const parent = targetElement.parentNode

    let previous = parent.children[targetIndex - 1]
    let next = parent.children[targetIndex]

    if (next) {
        if (moveDirection == 'down' && originIndex == +next.dataset.index) {
            next = parent.children[targetIndex + 1]
        }

        if (next.dataset.placeholder) {
            next = undefined
        }
    }

    if (previous) {
        if (moveDirection == 'up' && originIndex == +previous.dataset.index) {
            previous = parent.children[targetIndex - 2]
        }
    }

    return { previous, next }
}

export const useDrag = (args: any = { indentDelay: 100 }) => {
    const ghostRef = useRef(null)
    const { indentDelay } = args

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

export type DragManagerProps = {
    rotation?: number
    animation?: number
    moveThreshold?: number
    indentThreshold?: number
    linedRegionThreshold?: number
}

export const DragManager = (props: DragManagerProps) => {
    const {
        rotation = 2,
        animation = 200,
        moveThreshold = 0,
        indentThreshold = 10,
        linedRegionThreshold = 3,
    } = props
    const ghostRef = useRef<any>(null)
    const { origin } = getDragState('origin')
    const { target } = getDragState('target')
    const isDragging = !!origin.areaId
    const { endDrag, getCache, indent, outdent } = useDrag()
    const cache = getCache()

    const stopDrag = (reset = false) => {
        if (isDragging) {
            if (reset) {
                dispatchDragEvent('ondrop', { origin, target: cache.targetCache })
            } else {
                dispatchDragEvent('ondrop', { origin, target })
            }            
            endDrag()
            setTarget({})
            setOrigin({ targetVariant: {} })
            cache.mouseDown = false
        }
    }

    const handleMouseUp = (e) => {
        executeLast(stopDrag)
    }

    const handleKeyDown = (e) => {
        const { isEscape } = getKey(e)
        if (isEscape && isDragging) stopDrag(true)
    }

    const handleMouseMove = (e) => {
        if (isDragging) {
            const mouseY = e.clientY
            const mouseX = e.clientX
            const { offsetLeft, offsetTop } = cache.originMouse
            const x = mouseX - offsetLeft
            const y = mouseY - offsetTop
            let moveDirection: MoveDirection = null

            // position the ghost element first
            // syncronously with a callback so that it's smooth for the user
            positionDOMElement(x, y, rotation, ghostRef.current, () => {
                // calculate normal mouse movement
                if (mouseX < cache.mouse.x - moveThreshold) moveDirection = 'left'
                if (mouseX > cache.mouse.x + moveThreshold) moveDirection = 'right'
                if (mouseY < cache.mouse.y - moveThreshold) moveDirection = 'up'
                if (mouseY > cache.mouse.y + moveThreshold) moveDirection = 'down'

                // calculate indent mouse movement (jerking)
                // TODO: extend to accommodate vertical directions
                const shouldIndent = mouseX > cache.mouse.x + indentThreshold
                const shouldOutdent = mouseX < cache.mouse.x - indentThreshold

                // if the user jerks to the right, then indent
                // if the user jerks to the right, then outdent
                if (shouldIndent) indent()
                if (shouldOutdent) outdent()

                // cache mouse position
                cache.mouse = { x: mouseX, y: mouseY }

                // stop if there is no direction at all
                // and if there is no indentation movements
                if (!!moveDirection && !shouldIndent && !shouldOutdent) {
                    const element = documentObject.elementFromPoint(mouseX, mouseY)

                    // only process valid elements (non-offscreen)
                    if (!element) return
                    if (!element.dataset) return

                    // must be a dragelement and not non-droppable
                    const isDragElement = !!element.dataset.dragelement
                    const isDroppable = !element.dataset.nodrop

                    // stop if the target isn't a drag-element
                    if (isDragElement && isDroppable) {
                        const elementParentDirection = element.parentNode.dataset.direction
                        const elementParentGroup = element.parentNode.dataset.group

                        // only activate if there is a mouse direction & parent element direction
                        const shouldActivate =
                            elementParentDirection == 'vertical'
                                ? moveDirection == 'down' || moveDirection == 'up'
                                : elementParentDirection == 'horizontal'
                                ? moveDirection == 'left' || moveDirection == 'right'
                                : false

                        // see above
                        if (shouldActivate) {
                            let focus: boolean = false
                            const now = new Date().getTime()
                            const elementId = element.dataset.id
                            const elementIndex = +element.dataset.index
                            const elementIndent = element.dataset.indent ? +element.dataset.indent : 0
                            const elementAreaId = element.parentNode.dataset.areaid // element.dataset.areaid 🔴
                            const elementParentVariant: DragVariant = origin.targetVariant[elementParentGroup]

                            // TODO: find a non-hacky way to do this
                            const isFirstElement = element.offsetTop == 0
                            const isDifferentArea = cache.targetAreaId != elementAreaId

                            // this calculates where the cursor falls on the target element
                            // if it's just focus - then there is no regionSize because we want all of the area
                            // TODO: extend to accommodate vertical directions
                            if (elementParentVariant == 'lined-focus' || elementParentVariant == 'focus') {
                                const box = element.getBoundingClientRect()
                                const regionSize =
                                    elementParentVariant == 'focus' ? 0 : Math.round(box.height / linedRegionThreshold)

                                focus = mouseY >= box.top + regionSize && mouseY <= box.bottom - regionSize
                            }

                            // calculate index based on mouse direction & target direction
                            // keep the element target index if the user hovers over it
                            let targetIndex = focus
                                ? elementIndex
                                : elementParentDirection == 'vertical'
                                ? moveDirection == 'down'
                                    ? elementIndex + 1
                                    : elementIndex
                                : moveDirection == 'right'
                                ? elementIndex + 1
                                : elementIndex

                            // if its the 1st element & from coming in outside the area
                            // cache now() + animation time - 10ms minimum (buffer)
                            if (isFirstElement && isDifferentArea) cache.time = now + animation + 10

                            // if it's the first element, then always make sure to handle
                            // indexes normally only after the animation has timed out
                            // manually set mouse direction & target index
                            if (isFirstElement && now < cache.time) {
                                targetIndex = elementIndex
                                moveDirection = elementParentDirection == 'vertical' ? 'up' : 'left'
                            }

                            // ------------------------------------------------------------
                            // indentation calculation & caching
                            // ------------------------------------------------------------

                            // default indent is one from the target index/element
                            let targetIndent = elementIndent

                            // get this from the cache and use it if there is one
                            // this will get set in updateTargetIndent() above
                            const indentIsCached =
                                cache.indent.index == targetIndex && cache.indent.areaId == elementAreaId

                            // if it's cached then update the target with the cached level
                            if (indentIsCached) {
                                targetIndent = cache.indent.indent
                            } else {
                                // otherwise calculate the correct indent level based on the siblings
                                const { previous, next } = getPreviousNextElements(targetIndex, element, moveDirection)
                                const previousIndent = previous ? +previous.dataset.indent : 0
                                const nextIndent = next ? +next.dataset.indent : 0

                                // if the target index is part of a nested region
                                // then always take the bottom indent level - this is to keep the indent
                                // from breaking the hierarchy by auto-assuming the parent indent position
                                if (nextIndent > previousIndent) targetIndent = nextIndent

                                // cache the newly calculated indent level
                                cache.indent = {
                                    index: targetIndex,
                                    indent: targetIndent,
                                    areaId: elementAreaId,
                                    previous,
                                    previousIndent,
                                    next,
                                    nextIndent,
                                }

                                // outline the previous & next elements
                                // for (let target of element.parentNode.children) target.style.border = 'none'
                                // if (previous) previous.style.border = '0.2rem solid crimson'
                                // if (next) next.style.border = '0.2rem solid darkcyan'
                            }

                            // update the drag target
                            setTarget({
                                focus,
                                moveDirection,
                                index: targetIndex,
                                indent: targetIndent,
                                left: element.offsetLeft,
                                top: element.offsetTop,
                                height: element.offsetHeight,
                                width: element.offsetWidth,
                                areaId: elementAreaId,
                                elementId: elementId,
                                group: elementParentGroup,
                            })

                            // cache the ref for the target element
                            // update the area cache (to catch coming in from outside)
                            cache.moveDirection = moveDirection
                            cache.targetAreaId = elementAreaId
                            cache.targetElement = element
                            cache.targetIndex = targetIndex
                        }
                    }
                }
            })
        }
    }

    useWindowEvent('mousemove', handleMouseMove)
    useWindowEvent('mouseup', handleMouseUp)
    useWindowEvent('keydown', handleKeyDown)

    useEffect(() => {
        documentObject.documentElement.style.cssText = `--f-drag-speed: ${animation}ms`
    }, [])

    return (
        <div
            ref={ghostRef}
            id="f-drag-ghost"
            className="f-drag-ghost"
            style={{ display: isDragging ? 'block' : 'none' }}
        />
    )
}

export type DragAreaProps = {
    indent?: boolean
    areaId?: string
    group?: string
    variant?: DragVariant
    targetVariant?: any
    direction?: 'vertical' | 'horizontal'
    startDelay?: number
    footer?: any
} & CoreViewProps

export const DragArea = forwardRef((props: DragAreaProps, ref) => {
    const {
        areaId,
        group = 'default',
        variant = 'animated',
        targetVariant = {},
        direction = 'vertical',
        startDelay = 100,
        footer,
        ...rest
    } = props
    const { origin } = getDragState('origin')
    const { target } = getDragState('target')
    const { getGhostElement, setGhostElement, startDrag, getCache } = useDrag()
    const cache = getCache()
    const containerRef = useRef(null)
    const timeout = useRef(null)
    const hitbox = useRef<any>({})
    const animateFrame = useRef(null)
    const ready = useRef(false)
    const id = useId(areaId)
    const { lastIndex, noChildren } = useMemo(() => {
        const count = Children.count(props.children)
        return { noChildren: count == 0, lastIndex: count - 1 }
    }, [props.children])
    const {
        isLined,
        isLinedFocus,
        isFocus,
        isAnimated,
        isTargetArea,
        isHorizontal,
        isVertical,
        isDragging,
        hasOriginVariant,
        showBufferAndPlaceholder,
        finalTargetVariant,
    } = useMemo(() => {
        // variant is when the origin's DragArea specifies a variant
        // via "targetVariant" that affects this DragArea
        const originVariant: DragVariant = origin.targetVariant[group]
        const hasOriginVariant = !!originVariant
        const isLined = originVariant == 'lined'
        const isLinedFocus = originVariant == 'lined-focus'
        const isFocus = originVariant == 'focus'
        const isAnimated = originVariant == 'animated'
        const isHorizontal = direction == 'horizontal'
        const isVertical = direction == 'vertical'
        const isTargetArea = id == target.areaId
        const isDragging = !!origin.areaId
        const showBufferAndPlaceholder = isAnimated && isTargetArea
        // make sure to add THIS group's variant
        const finalTargetVariant = { ...targetVariant, [group]: variant }

        return {
            hasOriginVariant,
            isLined,
            isLinedFocus,
            isFocus,
            isAnimated,
            isHorizontal,
            isVertical,
            isTargetArea,
            isDragging,
            showBufferAndPlaceholder,
            finalTargetVariant,
        }
    }, [origin, target, id, direction, targetVariant, variant])
    const className = classNames(
        {
            'f-drag-area': true,
            'f-row': isHorizontal,
            'f-col': isVertical,
            'is-dragging': isDragging,
            'is-horizontal': isHorizontal,
            'is-vertical': isVertical,
            'no-origin-variant': !hasOriginVariant,
        },
        [props.className]
    )

    const setHitbox = () => {
        const { height, width, top, bottom } = getBoundingClientRect(containerRef.current)
        const divider = 5
        const zoneY = height / divider
        const zoneX = width / divider

        hitbox.current = { zoneY, zoneX, height, width, top, bottom }
    }

    const animationFrame = (timestamp) => {
        if (!origin.areaId) return

        if (isVertical) {
            if (cache.mouse.y < hitbox.current.top + hitbox.current.zoneY)
                containerRef.current.scrollTop = containerRef.current.scrollTop - 5
            if (cache.mouse.y > hitbox.current.bottom - hitbox.current.zoneY)
                containerRef.current.scrollTop = containerRef.current.scrollTop + 5
        }

        if (isHorizontal) {
            if (cache.mouse.x < hitbox.current.left + hitbox.current.zoneX)
                containerRef.current.scrollLeft = containerRef.current.scrollLeft - 5
            if (cache.mouse.x > hitbox.current.right - hitbox.current.zoneX)
                containerRef.current.scrollLeft = containerRef.current.scrollLeft + 5
        }

        animateFrame.current = requestAnimationFrame(animationFrame)
    }

    const handleMouseEnter = (e) => {
        if (isDragging) {
            setHitbox()
            animateFrame.current = requestAnimationFrame(animationFrame)
        }
    }

    const handleMouseLeave = (e) => {
        cancelAnimationFrame(animateFrame.current)
    }

    const handleMouseUp = (e) => {
        delete documentObject.body.dataset.dragginganimation
        ready.current = false
        clearTimeout(timeout.current)
    }

    const handleMouseMove = (e) => {
        // "ready" makes sure the start sequence only fires once
        // because we are looking for a mousemove event
        // TODO: see if there is a better way to handle a "mousemovestart"
        // startDrag() will notify "onstart" (sets CSS globals, etc)
        if (ready.current) {
            ready.current = false
            setOrigin(cache.init.origin)
            setTarget(cache.init.target)
            startDrag()
        }
    }

    const handleMouseDown = (e: any, index) => {
        const { isLeftButton } = getButton(e)
        const el = e.currentTarget
        const mouseLeft = e.clientX
        const mouseTop = e.clientY
        const areaId = id

        if (isLeftButton) {
            e.stopPropagation() //e.preventDefault()

            timeout.current = setTimeout(() => {
                ready.current = true

                // set up the initial data
                const { width, height, left, top } = getBoundingClientRect(el)
                const mouseOffsetLeft = mouseLeft - left
                const mouseOffsetTop = mouseTop - top
                const x = mouseLeft - mouseOffsetLeft
                const y = mouseTop - mouseOffsetTop
                const newNode = el.cloneNode(true)
                const indent = +el.dataset.indent
                const elementId = el.dataset.id
                const ghost = getGhostElement()

                // set the contents
                setGhostElement(newNode.outerHTML)

                // make sure the new node + ghost element are the same size
                resizeDOMElement(width, height, newNode)
                resizeDOMElement(width, height, ghost)

                // for indentation
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
                    cache.init = {
                        origin: {
                            targetVariant: finalTargetVariant,
                            elementId,
                            width,
                            height,
                            areaId,
                            index,
                            group,
                        },
                        target: {
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
                        },
                    }
                })
            }, startDelay)
        }
    }

    const renderPlaceholder = () => {
        if (!showBufferAndPlaceholder) return null

        const marginLeft = target.indent ? `calc(var(--f-drag-indent) * ${target.indent})` : 0
        const position = noChildren ? 'relative' : 'absolute'
        const width = isVertical ? target.width || origin.width : origin.width
        const height = isVertical ? origin.height : target.height || origin.height
        const transform = noChildren
            ? null
            : isVertical
            ? `translateY(${
                  target.moveDirection == 'down'
                      ? target.top + target.height
                      : target.moveDirection == 'up'
                      ? target.top
                      : 0
              }px)`
            : `translateX(${
                  target.moveDirection == 'right'
                      ? target.left + target.width
                      : target.moveDirection == 'left'
                      ? target.left
                      : 0
              }px)`

        return (
            <div
                data-placeholder={true}
                className="f-drag-area__placeholder"
                style={{ width, height, transform, position, marginLeft }}
            />
        )
    }

    const renderBuffer = () => {
        if (!showBufferAndPlaceholder) return null

        const width = isVertical ? target.width : origin.width
        const height = isVertical ? origin.height : target.height

        return (
            <div
                data-buffer={true}
                className="f-drag-area__buffer"
                style={{ width, height }}
            />
        )
    }

    const handleDragStart = (e) => {
        setTimeout(() => documentObject.body.dataset.dragginganimation = 'yes', startDelay)
    }

    const handleDragEnd = (e) => {
        delete documentObject.body.dataset.dragginganimation
    }

    useDragEvent('onstart', handleDragStart)
    useDragEvent('onend', handleDragEnd)
    useWindowEvent('mouseup', handleMouseUp)

    return (
        <View
            {...rest}
            id={id}
            ref={mergeRefs([ref, containerRef])}
            className={className}
            data-areaid={id}
            data-group={group}
            data-dragarea={true}
            data-direction={direction}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}>
            {renderChildren(props.children, (child: ReactElement, index: number) => {
                const indent = +child.props['data-indent'] || 0
                const isLast = lastIndex == index
                const isDragged = origin.index == index && origin.areaId == id
                const showFocused = target.focus && isTargetArea && index == target.index
                const showFirstPlaceholder = (isLinedFocus || isLined) && isTargetArea && index == target.index
                const showLastPlaceholder =
                    (isLinedFocus || isLined) && isTargetArea && index + 1 == target.index && isLast
                const noDrag = !!child.props['data-nodrag']

                return (
                    <div
                        data-index={index}
                        data-indent={indent}
                        data-areaid={id}
                        data-dragelement={true}
                        data-id={child.props['data-id']}
                        data-nodrop={child.props['data-nodrop']}
                        data-nodrag={child.props['data-nodrag']}
                        className="f-drag-area__element"
                        onMouseDown={(e) => (noDrag ? null : handleMouseDown(e, index))}
                        style={{
                            paddingLeft: `calc(var(--f-drag-indent) * ${indent})`,
                            display: isAnimated && isDragged ? 'none' : 'flex',
                            transform: isAnimated
                                ? isTargetArea && index >= target.index
                                    ? direction == 'vertical'
                                        ? `translateY(${origin.height}px)`
                                        : `translateX(${origin.width}px)`
                                    : null
                                : null,
                        }}>
                        {showFocused && isVertical && <div className="f-drag-area__element__lined-focus" />}
                        {showFirstPlaceholder && !showFocused && isVertical && (
                            <div className="f-drag-area__element__line is-vertical is-first" />
                        )}
                        {showLastPlaceholder && !showFocused && isVertical && (
                            <div className="f-drag-area__element__line is-vertical is-last" />
                        )}
                        {showFirstPlaceholder && isHorizontal && (
                            <div className="f-drag-area__element__line is-horizontal is-first" />
                        )}
                        {showLastPlaceholder && isHorizontal && (
                            <div className="f-drag-area__element__line is-horizontal is-last" />
                        )}
                        {child}
                    </div>
                )
            })}
            {renderPlaceholder()}
            {renderBuffer()}
            {footer}
        </View>
    )
})

export type DragElementAreaProps = {
    indent?: boolean
    areaId?: string
    group?: string
    variant?: DragVariant
    targetVariant?: any
    direction?: 'vertical'
    startDelay?: number
    footer?: any
} & CoreViewProps

export const DragElementArea = forwardRef((props: DragElementAreaProps, ref) => {
    const {
        areaId,
        group = 'default',
        variant = 'animated',
        targetVariant = {},
        direction = 'vertical',
        startDelay = 100,
        footer,
        ...rest
    } = props
    const { origin } = getDragState('origin')
    const { target } = getDragState('target')
    const containerRef = useRef(null)
    const bufferRef = useRef(null)
    const id = useId(areaId)
    const noChildren = useMemo(() => Children.count(props.children) == 0, [props.children])
    const { isHorizontal, isVertical, isDragging, hasOriginVariant, finalTargetVariant, placeholder } = useMemo(() => {
        // variant is when the origin's DragArea specifies a variant
        // via "targetVariant" that affects this DragArea
        // finalTargetVariant = make sure to add THIS group's variant
        const finalTargetVariant = JSON.stringify({ ...targetVariant, [group]: variant })
        const originVariant: DragVariant = origin.targetVariant[group]
        const hasOriginVariant = !!originVariant
        const isLined = originVariant == 'lined'
        const isLinedFocus = originVariant == 'lined-focus'
        const isFocus = originVariant == 'focus'
        const isAnimated = originVariant == 'animated'
        const isHorizontal = direction != 'vertical'
        const isVertical = direction == 'vertical'
        const isTargetFocus = target.focus
        const isTargetArea = id == target.areaId
        const isDragging = !!origin.areaId

        // moves to where the cursor is
        const placeholder: any = {
            visible: (isAnimated || isLined || isLinedFocus) && isTargetArea && !isTargetFocus,
            className: isAnimated ? 'f-drag-area__placeholder' : 'f-drag-area__placeholder-lined',
            marginLeft: target.indent ? `calc(var(--f-drag-indent) * ${target.indent})` : 0,
            width: target.indent ? `calc(100% - var(--f-drag-indent) * ${target.indent})` : '100%',
            // this needs to be considered at some point:
            // width: isVertical ? target.width || origin.width : origin.width,
            position: noChildren ? 'relative' : 'absolute',
            height: isVertical ? (isLined || isLinedFocus ? undefined : origin.height) : target.height || origin.height,
            transform: noChildren
                ? null
                : isVertical
                ? `translateY(${
                      target.moveDirection == 'down'
                          ? target.top + target.height
                          : target.moveDirection == 'up'
                          ? target.top
                          : 0
                  }px)`
                : `translateX(${
                      target.moveDirection == 'right'
                          ? target.left + target.width
                          : target.moveDirection == 'left'
                          ? target.left
                          : 0
                  }px)`,
        }

        return {
            isHorizontal,
            isVertical,
            isDragging,
            hasOriginVariant,
            finalTargetVariant,
            placeholder,
        }
    }, [id, origin, target, direction, targetVariant, variant])
    const className = classNames(
        {
            'f-drag-area': true,
            'f-row': isHorizontal,
            'f-col': isVertical,
            'is-dragging': isDragging,
            'is-horizontal': isHorizontal,
            'is-vertical': isVertical,
            'no-origin-variant': !hasOriginVariant,
        },
        [props.className]
    )

    const handleMouseUp = (e) => {
        delete documentObject.body.dataset.dragginganimation
    }

    const handleDragStart = (e) => {
        setTimeout(() => documentObject.body.dataset.dragginganimation = 'yes', startDelay)
    }

    const handleDragEnd = (e) => {
        delete documentObject.body.dataset.dragginganimation
    }

    useDragEvent('onstart', handleDragStart)
    useDragEvent('onend', handleDragEnd)
    useWindowEvent('mouseup', handleMouseUp)

    // --------------------------------------------------------------------------
    // manage buffer element & element transforms (reacting to the target index)
    // --------------------------------------------------------------------------

    useEffect(() => {
        let bufferHasBeenMadeVisible = false
        const isTargetArea = id == target.areaId
        const originVariant: DragVariant = origin.targetVariant[group]
        const isAnimated = originVariant == 'animated'

        containerRef.current.childNodes.forEach((node, index) => {
            // if its a dragelement & the right area
            // previously >>> && node.dataset.areaid == id
            if (node.dataset.dragelement) { 
                const isDragged = origin.index == index && origin.areaId == id

                // elementShouldFocus
                // if the target has focus (isFocus/isLinedFocus)
                // then highlight the DOM element by adding a data attr
                if (target.focus && isTargetArea && index == target.index) {
                    node.dataset.focus = 'yes'
                } else {
                    delete node.dataset.focus
                }

                // respect the inline display setting (task hierarchies)
                // if a user adds "display: flex" or "display: none" to the drag element,
                // then default back to that initial display property
                node.style.display = isAnimated && isDragged ? 'none' : node.dataset.fallbackdisplay || 'flex'

                // bufferShouldBeVisible
                // we do this here so that they are done at the same time
                // to avoid any glitches behaviour
                // previously >>> && isDragged
                if (isAnimated && isTargetArea) { 
                    bufferRef.current.style.display = 'block'
                    bufferRef.current.style.width = isVertical ? '100%' : origin.width + 'px'
                    bufferRef.current.style.height = isVertical ? origin.height + 'px' : '100%'
                    bufferHasBeenMadeVisible = true
                }

                // animate the node up or down
                // this is main drag animation (if it's isAnimated)
                node.style.transform = isAnimated
                    ? isTargetArea && index >= target.index
                        ? direction == 'vertical'
                            ? `translateY(${origin.height}px)`
                            : `translateX(${origin.width}px)`
                        : null
                    : null
            }
        })

        // if the buffer remains unaffected during transform
        // then hideh it because it's probably in another area
        if (!bufferHasBeenMadeVisible) bufferRef.current.style.display = 'none'
    }, [props.children, id, origin, target])

    // ---------------------------------------------------------------------
    // generate indexes on each element after it renders & before it paints
    // ---------------------------------------------------------------------

    useLayoutEffect(() => {
        // always set this to off when the component mounts
        // or if children change
        bufferRef.current.style.display = 'none'

        // wait for the dom to render the children first
        // 150ms is good estimate - might need to be adjusted
        // TODO: actually rework this
        setTimeout(() => {
            // we manually add the attr. for perfornace
            // instead of calculating each iteration (above)
            containerRef.current.childNodes.forEach((node, index) => {
                // only if its a dragelement - ignore buffer elements
                if (node.dataset.dragelement) {
                    node.dataset.index = index
                    node.dataset.areaid = id
                }
            })
        }, 150)
    }, [props.children])

    return (
        <View
            {...rest}
            id={id}
            ref={mergeRefs([ref, containerRef])}
            className={className}
            data-areaid={id}
            data-dragarea={true}
            data-group={group}
            data-direction={direction}
            data-targetvariant={finalTargetVariant}>
            {props.children}

            {placeholder.visible && (
                <div
                    className={placeholder.className}
                    data-placeholder={true}
                    style={{
                        transform: placeholder.transform,
                        marginLeft: placeholder.marginLeft,
                        position: placeholder.position,
                        width: placeholder.width,
                        height: placeholder.height,
                    }}
                />
            )}

            <div
                ref={bufferRef}
                data-buffer={true}
                className="f-drag-area__buffer"
            />

            {footer}
        </View>
    )
})

export type DragElementProps = {
    id?: string
    indent?: number
    noDrop?: boolean
    noDrag?: boolean
} & Omit<CoreViewProps, 'indent'>

export const DragElement = (props: DragElementProps) => {
    const { id, indent = 0, noDrop, noDrag, style = {}, ...rest } = props
    const fallbackDisplay = useMemo(() => style.display, [style])
    const { onMouseDown, onMouseUp } = useDrag()
    const elementRef = useRef(null)
    const styles = useMemo(
        () => ({
            ...style,
            width: indent ? `calc(100% - var(--f-drag-indent) * ${indent})` : '100%',
            marginLeft: indent ? `calc(var(--f-drag-indent) * ${indent})` : undefined,
        }),
        [style, indent]
    )
    const className = classNames(
        {
            'f-drag-element': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            id={id}
            data-id={id}
            data-indent={indent}
            data-nodrop={noDrop}
            data-nodrag={noDrag}
            data-fallbackdisplay={fallbackDisplay} // see DragElementArea
            data-dragelement={true}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={styles}
            ref={elementRef}
            className={className}>
            {props.children}
        </View>
    )
}
