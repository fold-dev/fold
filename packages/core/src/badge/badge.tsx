import React from 'react'
import { Text, View } from '..'
import { classNames, getActionClass } from '../helpers'
import { CoreViewProps, Size, Variant } from '../types'

export type BadgeAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export type BadgeProps = {
    size?: Size
    variant?: Variant
    anchor?: BadgeAnchor
    outline?: boolean
} & CoreViewProps

export const Badge = (props: BadgeProps) => {
    const { size = 'md', variant = 'default', anchor, outline, ...rest } = props
    const className = classNames(
        {
            'f-badge': true,
            'f-row': true,
            'is-outline': outline,
            'no-children': !props.children,
        },
        [props.className, getActionClass(variant), getActionClass(anchor), size]
    )

    return (
        <View
            {...rest}
            className={className}>
            {props.children && (
                <Text
                    className="f-badge__text"
                    size={size}
                    as="span">
                    {props.children}
                </Text>
            )}
        </View>
    )
}
