import * as React from 'react'
import { View } from '..'
import { CommonProps, CoreViewProps, Size } from '../types'
import { classNames } from '../helpers'

export type SpinnerOverlayProps = {
    size?: Size
    thickness?: number
    color?: string
} & CoreViewProps

export const SpinnerOverlay = (props: SpinnerOverlayProps) => {
    const { size, thickness, color, ...rest } = props
    const className = classNames(
        {
            'f-spinner-overlay': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            as="span"
            className={className}>
            <Spinner
                size={size}
                thickness={thickness}
                color={color}
            />
        </View>
    )
}

export type SpinnerProps = {
    size?: Size
    color?: string
    thickness?: number
} & CommonProps

export const Spinner = (props: SpinnerProps) => {
    const { size = 'md', thickness = 5, style = {} } = props
    const className = classNames(
        {
            'f-spinner': true,
        },
        [props.className, size]
    )

    return (
        <svg
            className={className}
            viewBox="0 0 50 50"
            style={{ ...style, color: props.color }}>
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth={thickness}></circle>
        </svg>
    )
}
