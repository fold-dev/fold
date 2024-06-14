import React, { cloneElement, forwardRef, ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFocus, useId, View } from '..'
import {
    classNames,
    documentObject,
    getBoundingClientRect,
    getKey,
    getPopoutClass,
    isBoxOffScreen,
    mergeRefs,
    renderChildren,
} from '../helpers'
import { useEvent } from '../hooks/event.hook'
import { CoreViewProps, PopoutPosition } from '../types'
import { dispatchPopoverEvent } from './popover.event'

export * from './popover.event'

export const PopoverContent = forwardRef((props: CoreViewProps, ref) => (
    <View
        {...props}
        ref={ref}
    />
))

export type PopoverAnchor = PopoutPosition

export type PopoverProps = {
    __globalEscape?: boolean
    __focusTrapTimeoutDelay?: number
    focusTrap?: boolean
    targetId?: string
    fixPosition?: { top: number; left: number }
    arrow?: boolean
    anchor?: PopoverAnchor
    anchorProps?: any
    content?: ReactElement | any
    isVisible?: boolean
    onDismiss?: any
} & CoreViewProps

export const Popover = forwardRef((props: PopoverProps, ref) => {
    const {
        __globalEscape,
        __focusTrapTimeoutDelay = 100,
        focusTrap,
        targetId,
        fixPosition,
        anchorProps = {},
        arrow = false,
        anchor,
        content,
        isVisible,
        onDismiss,
        ...rest
    } = props
    const containerRef = useRef(null)
    const childRef = useRef(null)
    const [box, setBox] = useState<any>({})
    const [ready, setReady] = useState(false)
    const [finalAnchor, setFinalAnchor] = useState('')
    const id = useId(targetId)
    const showPopover = isVisible && id && !!finalAnchor
    const isFixed = !!fixPosition
    const { trapFocus } = useFocus()
    const className = classNames(
        {
            'f-popover': true,
            'has-arrow': arrow,
            'is-ready': ready,
        },
        [props.className, getPopoutClass(finalAnchor)]
    )

    const dismissPopover = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatchPopoverEvent('ondismiss', e)
        onDismiss(e)
        setReady(false)
        childRef.current?.focus()
    }

    const handleKeyDown = (e) => {
        const { isEscape } = getKey(e)

        // if the escape event is inside the popup
        // or is from the popup itself, then close
        if (isEscape) {
            if (__globalEscape) {
                if (onDismiss) dismissPopover(e)
            } else {
                if (containerRef.current) {
                    if (containerRef.current?.contains(e.target) || containerRef.current == e.target) {
                        if (onDismiss) dismissPopover(e)
                    }
                }
            }
        }
    }

    const handleClick = (e) => {
        if (containerRef.current) {
            if (!containerRef.current?.contains(e.target)) {
                if (onDismiss) dismissPopover(e)
            }
        }
    }

    useEvent('click', handleClick, true)
    useEvent('keydown', handleKeyDown, true)

    useLayoutEffect(() => {
        if (!id) return
        if (!isVisible) return

        const childEl = childRef.current || documentObject.getElementById(id)
        const popoverEl = containerRef.current
        const childRect = getBoundingClientRect(childEl)
        const popoverRect = getBoundingClientRect(popoverEl)
        const box = {
            top: fixPosition ? fixPosition.top : childEl.offsetTop,
            left: fixPosition ? fixPosition.left : childEl.offsetLeft,
            width: fixPosition ? 1 : childEl.offsetWidth,
            height: fixPosition ? 1 : childEl.offsetHeight,
        }
        const offscreen = isBoxOffScreen({
            top: fixPosition ? fixPosition.top : childRect.bottom,
            left: fixPosition ? fixPosition.left : childRect.left,
            width: popoverRect.width,
            height: popoverRect.height,
        })
        const horizontal = offscreen.x ? 'right' : 'left'
        const vertical = offscreen.y ? 'top' : 'bottom'
        const autoPosition = `${vertical}-${horizontal}`
        const finalAnchor = anchor ? anchor : autoPosition

        setBox(box)
        setReady(!!Object.keys(popoverRect).length)
        setFinalAnchor(finalAnchor)

        // adjust for the top going offscreen
        if (!finalAnchor) return
        if (!containerRef.current) return

        // only focus on top vertical for now
        // TODO: extend for horizontal (less likely - except mobile!)
        if (finalAnchor.includes('top')) {
            const { height } = popoverRect
            const top = box.top - height
            if (top < 0) containerRef.current.style.top = top * -1 + 'px'
        }

        return () => containerRef.current?.style.removeProperty('top')
    }, [showPopover, content, fixPosition, props.children, ready])

    useEffect(() => {
        if (focusTrap && showPopover && containerRef.current) {
            // give react & the browser some time to mount
            setTimeout(() => trapFocus(containerRef.current), __focusTrapTimeoutDelay)
        }
    }, [showPopover])

    return (
        <>
            {renderChildren(props.children, (child) => {
                return cloneElement(child, {
                    ...child.props,
                    ref: mergeRefs([child.ref, childRef]),
                    id: child.props.id || id,
                })
            })}

            {showPopover && (
                <div
                    onKeyDown={handleKeyDown}
                    className="f-popover__anchor"
                    style={{
                        transform: `translate(${box.left}px, ${box.top}px)`,
                        width: box.width,
                        height: box.height,
                        position: isFixed ? 'fixed' : 'absolute',
                    }}
                    {...anchorProps}>
                    <View
                        {...rest}
                        tabIndex={0}
                        aria-describedby={id}
                        className={className}
                        ref={mergeRefs([ref, containerRef])}>
                        {content}
                    </View>
                </div>
            )}
        </>
    )
})
