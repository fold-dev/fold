import { useDragging } from '../hooks/dragging.hook'
import { useEvent } from '../hooks/event.hook'
import { CoreViewProps } from '../types'
import React, { ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, useWindowResize } from '..'
import { classNames, getBoundingClientRect, getActionClass, globalCursor } from '../helpers'

export type ResizableRailProps = {
    transparent?: boolean
    handle?: ReactElement
    direction?: 'horizontal' | 'vertical'
    position?: 'start' | 'end'
    onChange?: any
    onDragStart?: any
} & Omit<CoreViewProps, 'position' | 'onChange'>

export const ResizableRail = (props: ResizableRailProps) => {
    const { transparent, handle, direction = 'horizontal', position = 'end', onChange, onDragStart, ...rest } = props
    const isHorizontal = direction == 'horizontal'
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

        if (onDragStart) onDragStart({ x: e.clientX, y: e.clientY })

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
    const { dragging } = useDragging()
    const [box, setBox] = useState<any>({})
    const [height, setHeight] = useState(props.height || 0)
    const [width, setWidth] = useState(props.width || 0)
    const dragSnapshot = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
    const dimensions = useWindowResize()
    const className = classNames(
        {
            'f-resizable': true,
            'is-dragging': dragging,
        },
        [props.className]
    )

    const handleDragStart = ({ x, y }) => {
        const rect = elementRef.current.getBoundingClientRect()
        dragSnapshot.current = {
            startX: x,
            startY: y,
            startWidth: rect.width,
            startHeight: rect.height,
        }
    }

    const calculateVerticalMovement = ({ x, y }) => {
        const { startY, startHeight } = dragSnapshot.current
        const deltaY = y - startY

        let newHeight = isEnd ? startHeight + deltaY : startHeight - deltaY

        if (min && newHeight <= min) newHeight = min
        if (max && newHeight >= max) newHeight = max

        setHeight(newHeight)
        if (onChange) onChange(newHeight)
    }

    const calculateHorizontalMovement = ({ x, y }) => {
        const { startX, startWidth } = dragSnapshot.current
        const deltaX = x - startX

        let newWidth = isEnd ? startWidth + deltaX : startWidth - deltaX

        if (min && newWidth <= min) newWidth = min
        if (max && newWidth >= max) newWidth = max

        setWidth(newWidth)
        if (onChange) onChange(newWidth)
    }

    const handleResizableChange = ({ x, y }) => {
        if (isVertical) calculateVerticalMovement({ x, y })
        if (isHorizontal) calculateHorizontalMovement({ x, y })
    }

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (elementRef.current) {
                setBox(getBoundingClientRect(elementRef.current))
            }
        })

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (elementRef.current) {
            setBox(getBoundingClientRect(elementRef.current))
        }
    }, [dimensions])

    useLayoutEffect(() => {
        if (value === undefined || value === null) return
        if (isHorizontal) setWidth(value)
        if (isVertical) setHeight(value)
    }, [value, isHorizontal, isVertical])

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
                onDragStart={handleDragStart}
                {...railProps}
            />
            {props.children}
        </View>
    )
}
