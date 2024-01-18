import { classNames } from '../helpers'
import React from 'react'
import { View } from '..'
import { CoreViewProps } from '../types'

export type SkeletonProps = {
    on?: boolean
} & CoreViewProps

export const Skeleton = (props: SkeletonProps) => {
    const { on = false, ...rest } = props
    const className = classNames(
        {
            'f-skeleton': on,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}
        />
    )
}

export const SkeletonBlock = (props: CoreViewProps) => (
    <View
        className="f-skeleton-block"
        {...props}
    />
)

export const SkeletonCircle = (props: { size: number } & CoreViewProps) => {
    const { size, ...rest } = props
    return (
        <View
            className="f-skeleton-circle"
            width={size}
            height={size}
            {...rest}
        />
    )
}
