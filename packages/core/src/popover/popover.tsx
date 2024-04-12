import React, { cloneElement, forwardRef, ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useId, View } from '..'
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
    const showPopover = isVisible && id && finalAnchor
    const isFixed = !!fixPosition
    const className = classNames(
        {
            'f-popover': true,
            'has-arrow': arrow,
            'is-ready': ready,
        },
        [props.className, getPopoutClass(finalAnchor)]
    )

    const dismissPopover = (e) => {
        dispatchPopoverEvent('ondismiss', e)
        onDismiss(e)
        setReady(false)
    }

    const handleKeyDown = (e) => {
        const { isEscape } = getKey(e)
        if (isEscape && onDismiss) dismissPopover(e)
    }

    const handleClick = (e) => {
        if (containerRef.current) {
            if (!containerRef.current?.contains(e.target)) {
                if (onDismiss) dismissPopover(e)
            }
        }
    }

    useEvent('keydown', handleKeyDown, true)
    useEvent('click', handleClick, true)

    useEffect(() => {
        if (!id) return
        if (!isVisible) return

        const childEl = childRef.current || documentObject.getElementById(id)
        const popoverEl = containerRef.current
        const childRect = getBoundingClientRect(childEl)
        const popoverRect = getBoundingClientRect(popoverEl)

        setBox({
            top: fixPosition ? fixPosition.top : childEl.offsetTop,
            left: fixPosition ? fixPosition.left : childEl.offsetLeft,
            width: fixPosition ? 1 : childEl.offsetWidth,
            height: fixPosition ? 1 : childEl.offsetHeight,
        })

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

        setReady(!!Object.keys(popoverRect).length)
        setFinalAnchor(finalAnchor)
    }, [showPopover, content, fixPosition, props.children, ready])

    // TODO: refine
    // this is reponsible for detection buffers in top offscreen
    useEffect(() => {
        if (!id) return
        if (!isVisible) return
        if (!finalAnchor) return

        const { top } = getBoundingClientRect(containerRef.current)

        if (top < 0) {
            containerRef.current.style.top = top * -1 + 'px'
        } else {
            containerRef.current.style.removeProperty('top')
        }
    }, [showPopover, fixPosition, props.children, ready])

    return (
        <>
            {renderChildren(props.children, (child) => {
                return cloneElement(child, {
                    ...child.props,
                    ref: mergeRefs([child.ref, childRef]),
                    id,
                })
            })}

            {showPopover && (
                <div
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
