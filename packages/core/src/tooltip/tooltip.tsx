import React, { Children, ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Portal, View, useId } from '..'
import {
    blurElement,
    classNames,
    documentObject,
    focusElement,
    generateUEID,
    getBoundingClientRect,
    getKey,
    getPopoutClass,
    renderWithProps,
} from '../helpers'
import { useEvent } from '../hooks/event.hook'
import { useTimer } from '../hooks/timer.hook'
import { Text } from '../text/text'
import { CoreViewProps, PopoutPosition } from '../types'

const REPOSITION_INTERVAL = 100

export type TooltipAnchor = PopoutPosition

export type TooltipContentProps = {
    anchor?: TooltipAnchor
    arrow?: boolean
} & CoreViewProps

export const TooltipContent = (props: TooltipContentProps) => {
    const { anchor = 'top-center', arrow = true, ...rest } = props
    const className = classNames(
        {
            'f-tooltip-content': true,
            'has-arrow': arrow,
        },
        [props.className, getPopoutClass(anchor)]
    )

    return (
        <View
            {...rest}
            className={className}
        />
    )
}

export type TooltipProps = {
    arrow?: boolean
    text?: string
    anchor?: TooltipAnchor
    alwaysVisible?: boolean
    content?: ReactElement
    delay?: number
    contentProps?: TooltipContentProps
    onDismiss?: any
} & CoreViewProps

export const Tooltip = (props: TooltipProps) => {
    const {
        arrow = true,
        text,
        anchor = 'top-center',
        alwaysVisible = false,
        content,
        delay = 500,
        contentProps = {},
        onDismiss,
        ...rest
    } = props
    const childRef = useRef(null)
    const timerRef = useRef(null)
    const timeoutRef = useRef(null)
    const id = useId()
    const [isVisible, setVisible] = useState(false)
    const [box, setBox] = useState<any>(null)
    const { setTimer, clearTimer } = useTimer()
    const showTooltip = box && (isVisible || alwaysVisible)
    const className = classNames(
        {
            'f-tooltip': true,
        },
        [props.className]
    )

    const updateBox = () => setBox(getBoundingClientRect(childRef.current))

    const handleMouseEnter = (e) => {
        if (e.currentTarget != childRef.current) return
        //focusElement(childRef.current)
        timeoutRef.current = setTimeout(() => {
            updateBox()
            setVisible(true)
        }, delay)
    }

    const handleMouseDismiss = (e) => {
        console.log(e.currentTarget, childRef.current)
        if (e.currentTarget != childRef.current) return
        blurElement(childRef.current)
        clearInterval(timeoutRef.current)
        dismissTooltip()
    }

    const dismissTooltip = () => {
        if (alwaysVisible) return
        clearTimer()
        setVisible(false)
        if (onDismiss) onDismiss()
    }

    const handleKeyDown = (e) => {
        const { isEscape } = getKey(e)
        if (isEscape) dismissTooltip()
    }

    useEvent('keydown', handleKeyDown)

    useEffect(() => {
        updateBox()

        childRef.current?.addEventListener('focus', handleMouseEnter)
        childRef.current?.addEventListener('mouseenter', handleMouseEnter)
        childRef.current?.addEventListener('mouseleave', handleMouseDismiss)
        childRef.current?.addEventListener('mouseout', handleMouseDismiss)
        childRef.current?.addEventListener('mousedown', handleMouseDismiss)
        childRef.current?.addEventListener('blur', handleMouseDismiss)

        return () => {
            childRef.current?.removeEventListener('focus', handleMouseEnter)
            childRef.current?.removeEventListener('mouseenter', handleMouseEnter)
            childRef.current?.removeEventListener('mouseleave', handleMouseDismiss)
            childRef.current?.removeEventListener('mouseout', handleMouseDismiss)
            childRef.current?.removeEventListener('mousedown', handleMouseDismiss)
            childRef.current?.removeEventListener('blur', handleMouseDismiss)
        }
    }, [props.children])

    useLayoutEffect(() => {
        timerRef.current = showTooltip ? setInterval(updateBox, REPOSITION_INTERVAL) : null
        return () => clearInterval(timerRef.current)
    })

    return (
        <>
            {renderWithProps(props.children, {
                'ref': childRef,
                'aria-describedby': id,
            })}

            {showTooltip && (
                <Portal>
                    <View
                        {...rest}
                        id={id}
                        style={box}
                        className={className}
                        role="tooltip">
                        <TooltipContent
                            anchor={anchor}
                            arrow={arrow}
                            {...contentProps}>
                            {content ? content : <Text>{text}</Text>}
                        </TooltipContent>
                    </View>
                </Portal>
            )}
        </>
    )
}
