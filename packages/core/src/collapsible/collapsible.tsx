import React, { createElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useResize, View } from '..'
import { classNames } from '../helpers'
import { CoreViewProps } from '../types'

export type CollapsibleProps = {
    as?: 'div' | 'span'
    open?: boolean
} & CoreViewProps

export const Collapsible = (props: CollapsibleProps) => {
    const { as = 'span', open = false, style = {}, children, ...rest } = props
    const className = classNames(
        {
            'f-collapsible': true,
            'is-closed': !open,
        },
        [props.className]
    )
    const contentRef = useRef(null)
    const [maxHeight, setMaxHeight] = useState(1000)
    const dimensions = useResize(contentRef.current)

    useLayoutEffect(() => {
        setMaxHeight(contentRef.current?.offsetHeight)
    }, [props.children, dimensions])

    return (
        <View
            {...rest}
            as={as}
            aria-expanded={open}
            className={className}
            style={{
                ...style,
                maxHeight,
            }}>
            {createElement(as, { className: 'f-collapsible__content', ref: contentRef }, children)}
        </View>
    )
}
