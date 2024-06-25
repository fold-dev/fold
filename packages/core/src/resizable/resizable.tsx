import { useDragging } from '../hooks/dragging.hook'
import { useEvent } from '../hooks/event.hook'
import { CoreViewProps } from '../types'
import React, { ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, useResize, useWindowResize } from '..'
import {
    classNames,
    documentObject,
    executeLast,
    getActionClass,
    getBoundingClientRect,
    globalCursor,
    windowObject,
} from '../helpers'

export type ResizableRailProps = {
    transparent?: boolean
    handle?: ReactElement
    direction?: 'horizontal' | 'vertical'
    position?: 'start' | 'end'
    onChange?: any
} & Omit<CoreViewProps, 'position' | 'onChange'>

export const ResizableRail = (props: ResizableRailProps) => {
    const { transparent, handle, direction = 'horizontal', position = 'end', onChange, ...rest } = props
    const isHorizontal = direction == 'horizontal'
    const isVertical = direction == 'vertical'
    const isStart = position == 'start'
    const isEnd = position == 'end'
    const { dragging, startDragging, stopDragging } = useDragging()
    const className = classNames(
        {
            'f-resizable-rail': true,
            'is-dragging': dragging,
            'is-transparent': transparent,
        },
        [getActionClass(direction), getActionClass(position)]
    )
    const classNameHandleDefault = classNames({
        'f-resizable-rail__handle-default': true,
        'is-dragging': dragging,
    })

    const handleMouseMove = (e) => {
        if (dragging) onChange({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = (e) => {
        e.preventDefault()
        e.stopPropagation()
        startDragging()
    }

    const handleMouseUp = (e) => {
        stopDragging()
    }

    useEvent('mousemove', handleMouseMove)
    useEvent('mouseup', handleMouseUp)

    useLayoutEffect(() => {
        if (dragging) {
            if (isHorizontal) {
                globalCursor.add('col')
            } else {
                globalCursor.add('row')
            }
        } else {
            globalCursor.remove('row')
            globalCursor.remove('col')
        }
    }, [dragging, direction])

    return (
        <View
            {...rest}
            className={className}
            onMouseDown={handleMouseDown}>
            <div className="f-resizable-rail__handle">
                {!handle && <div className={classNameHandleDefault} />}
                {handle}
            </div>
        </View>
    )
}

export type ResizableProps = {
    transparent?: boolean
    value?: number
    handle?: ReactElement
    direction?: 'horizontal' | 'vertical'
    position?: 'start' | 'end'
    min?: number
    max?: number
    onChange?: any
    railProps?: any
} & Omit<CoreViewProps, 'position' | 'onChange'>

export const Resizable = (props: ResizableProps) => {
    const {
        transparent,
        value,
        handle,
        direction = 'horizontal',
        position = 'end',
        min,
        max,
        onChange,
        railProps = {},
        ...rest
    } = props
    const elementRef = useRef(null)
    const isHorizontal = direction == 'horizontal'
    const isVertical = direction == 'vertical'
    const isStart = position == 'start'
    const isEnd = position == 'end'
    const { dragging, startDragging, stopDragging } = useDragging()
    const [box, setBox] = useState<any>({})
    const [height, setHeight] = useState(props.height)
    const [width, setWidth] = useState(props.width)
    const dimensions = useWindowResize()
    const className = classNames(
        {
            'f-resizable': true,
            'is-dragging': dragging,
        },
        [props.className]
    )

    const calculateVerticalMovement = ({ x, y }) => {
        const scrollTop = documentObject.documentElement.scrollTop || documentObject.body.scrollTop
        const boxTop = scrollTop + box.top

        let height = isEnd ? box.height + (y - (boxTop + box.height)) : box.height + (boxTop - y)

        if (min) {
            if (height <= min) height = min
        }

        if (max) {
            if (height >= max) height = max
        }

        setHeight(height)
        if (onChange) onChange(height)
    }

    const calculateHorizontalMovement = ({ x, y }) => {
        let width = isEnd ? box.width + (x - (box.left + box.width)) : box.width + (box.left - x)

        if (min) {
            if (width <= min) width = min
        }

        if (max) {
            if (width >= max) width = max
        }

        setWidth(width)
        if (onChange) onChange(width)
    }

    const handleResizableChange = ({ x, y }) => {
        if (isVertical) calculateVerticalMovement({ x, y })
        if (isHorizontal) calculateHorizontalMovement({ x, y })
    }

    useEffect(() => {
        setBox(getBoundingClientRect(elementRef.current))
    }, [width, height, dimensions])

    useLayoutEffect(() => {
        if (!value) return
        if (isHorizontal) setWidth(value)
        if (isVertical) setHeight(value)
    }, [value])

    return (
        <View
            {...rest}
            ref={elementRef}
            className={className}
            width={width}
            height={height}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={isHorizontal ? Number(width) : Number(height)}>
            <ResizableRail
                transparent={transparent}
                direction={direction}
                position={position}
                handle={handle}
                onChange={handleResizableChange}
                {...railProps}
            />
            {props.children}
        </View>
    )
}
