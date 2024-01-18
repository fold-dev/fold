import React, { ReactElement, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { View } from '..'
import { classNames, formatCSSDimension, getBoundingClientRect } from '../helpers'
import { useResize } from '../hooks/resize.hook'
import { CoreViewProps } from '../types'

export type DividerProps = {
    contentPosition?: string | number
    direction?: 'horizontal' | 'vertical'
    content?: ReactElement
} & CoreViewProps

export const Divider = (props: DividerProps) => {
    const { style = {}, contentPosition = '50%', direction = 'horizontal', content, ...rest } = props
    const containerRef = useRef(null)
    const isVertical = direction == 'vertical'
    const isHorizontal = direction == 'horizontal'
    const dimensions = useResize(containerRef.current)
    const [height, setHeight] = useState('100%')
    const styles = { ...style, height: isVertical ? height : 1 }
    const contentStyles = useMemo(() => {
        return direction == 'horizontal'
            ? { left: formatCSSDimension(contentPosition) }
            : { top: formatCSSDimension(contentPosition) }
    }, [content, direction, contentPosition])
    const className = classNames(
        {
            'f-divider': true,
            'is-horizontal': isHorizontal,
            'is-vertical': isVertical,
        },
        [props.className]
    )
    const contentClassName = classNames({
        'f-divider__content': true,
        'is-horizontal': isHorizontal,
        'is-vertical': isVertical,
    })

    useLayoutEffect(() => {
        const { height } = getBoundingClientRect(containerRef.current?.parentNode)
        setHeight(height)
    }, [dimensions])

    return (
        <View
            {...rest}
            className={className}
            style={styles}
            ref={containerRef}>
            {content && (
                <div
                    style={contentStyles}
                    className={contentClassName}>
                    {content}
                </div>
            )}
            <hr />
        </View>
    )
}
