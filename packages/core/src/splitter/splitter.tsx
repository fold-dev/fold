import React, { cloneElement, ReactElement, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Resizable, View } from '..'
import { classNames, getBoundingClientRect } from '../helpers'
import { useDragging } from '../hooks/dragging.hook'
import { useEvent } from '../hooks/event.hook'
import { useResize } from '../hooks/resize.hook'
import { CoreViewProps } from '../types'

export type SplitterProps = {
    snap?: boolean
    min?: number
    max?: number
    handle?: ReactElement
    start?: number
    direction?: 'horizontal' | 'vertical'
    resizableProps?: any /* edge case */
} & CoreViewProps

export const Splitter = (props: SplitterProps) => {
    const {
        snap = false,
        min = 0,
        max = 1,
        handle,
        start = 0.5,
        direction = 'horizontal',
        resizableProps,
        ...rest
    } = props
    const isHorizontal = direction == 'horizontal'
    const isVertical = direction == 'vertical'
    const containerRef = useRef(null)
    const dimensions = useResize(containerRef.current)
    const [value, setValue] = useState(null)
    const [boundary, setBoundary] = useState({ min: 0, max: 1 })
    const { resizableWidth, resizableHeight } = useMemo(
        () => ({
            resizableWidth: isHorizontal ? `${start * 100}%` : '100%',
            resizableHeight: isVertical ? `${start * 100}%` : '100%',
        }),
        [start]
    )
    const className = classNames(
        {
            'f-splitter': true,
            'f-row': isHorizontal,
            'f-col': isVertical,
        },
        [props.className]
    )
    const { dragging, startDragging, stopDragging } = useDragging()

    const handleMouseDown = (e) => {
        e.preventDefault()
        e.stopPropagation()
        startDragging()
    }

    const handleMouseMove = (e) => {
        if (!dragging) return

        e.preventDefault()
        e.stopPropagation()

        const parent = e.currentTarget.parentNode
        const bounds = getBoundingClientRect(parent)
        const left = e.clientX - bounds.left
        const top = e.clientY - bounds.top

        if (!snap) return
        if (isHorizontal) setValue(left)
        if (isVertical) setValue(top)
    }

    const handleMouseUp = (e) => {
        e.preventDefault()
        e.stopPropagation()
        stopDragging()
    }

    useEvent('mouseup', handleMouseUp)

    useLayoutEffect(() => {
        const box = getBoundingClientRect(containerRef.current)

        setBoundary({
            min: isVertical ? box.height * min : box.width * min,
            max: isVertical ? box.height * max : box.width * max,
        })
    }, [dimensions])

    return (
        <View
            {...rest}
            ref={containerRef}
            className={className}>
            <Resizable
                value={value}
                role="separator"
                direction={direction}
                width={resizableWidth}
                height={resizableHeight}
                min={boundary.min}
                max={boundary.max}
                handle={handle}
                {...resizableProps}>
                <div className="f-splitter__resizable">
                    {cloneElement(props.children[0], {
                        onMouseDown: handleMouseDown,
                        onMouseMove: handleMouseMove,
                    })}
                </div>
            </Resizable>

            {cloneElement(props.children[1], {
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
            })}
        </View>
    )
}

export const SplitterContent = (props: CoreViewProps) => {
    const className = classNames(
        {
            'f-splitter-content': true,
        },
        [props.className]
    )
    return (
        <View
            {...props}
            className={className}
            onMouseDown={props.onMouseDown}
        />
    )
}
