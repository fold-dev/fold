import { CoreViewProps } from '../types'
import { classNames, formatCSSDimension, getValidObject, renderChildren } from '../helpers'
import React, { cloneElement, forwardRef, useLayoutEffect, useMemo, useRef } from 'react'
import { View, useId } from '..'

export type StackProps = {
    noStretch?: boolean
    direction?: 'vertical' | 'horizontal'
    spacing: string | number
} & CoreViewProps

export const Stack = forwardRef((props: StackProps, ref) => {
    const { noStretch, direction = 'horizontal', spacing = 0, style = {}, ...rest } = props
    const isHorizontal = direction == 'horizontal'
    const isVertical = direction == 'vertical'

    const cssSpacing = useMemo(() => formatCSSDimension(spacing), [spacing])
    const styles: any = useMemo(
        () => ({
            ...style,
            '--f-stack-spacing-top': isVertical ? cssSpacing : 'none',
            '--f-stack-spacing-left': isHorizontal ? cssSpacing : 'none',
        }),
        [style, cssSpacing, direction]
    )
    const className = classNames(
        {
            'f-stack': true,
            'f-col': isVertical,
            'f-row': isHorizontal,
            'is-nostretch': noStretch,
        },
        [props.className]
    )

    /*
    Here are some code-only solutions:

    option 1:

    const containerRef = useRef(null)
    
    useLayoutEffect(() => {
        Array.from(containerRef.current.children).map((el: any, index: number) => {
            if (index == 0) return
            if (isVertical) el.style.marginTop = cssSpacing
            if (isHorizontal) el.style.marginLeft = cssSpacing
        })
    }, [])

    option 2:

    <View {...rest} className={className} ref={containerRef}>
        {renderChildren(props.children, (child: any, index: number) => {
            let style = getValidObject(child.props.style)

            if (index != 0) {
                if (isVertical) style.marginTop = cssSpacing
                if (isHorizontal) style.marginLeft = cssSpacing
            }                

            return cloneElement(child, { ...child.props, style })
        })}
    </View>
    */

    return (
        <View
            {...rest}
            className={className}
            ref={ref}
            style={styles}
        />
    )
})
