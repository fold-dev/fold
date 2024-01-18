import React from 'react'
import { View } from '..'
import { classNames, getActionClass } from '../helpers'
import { CoreViewProps, Variant } from '../types'

export type NotificationIconProps = {} & CoreViewProps

export const NotificationIcon = (props: NotificationIconProps) => {
    const className = classNames(
        {
            'f-notification__icon': true,
            'f-row': true,
            'f-buttonize': props.onClick,
        },
        [props.className]
    )

    return (
        <View
            {...props}
            className={className}
        />
    )
}

export type NotificationContentProps = {} & CoreViewProps

export const NotificationContent = (props: NotificationContentProps) => {
    const className = classNames(
        {
            'f-notification__content': true,
        },
        [props.className]
    )

    return (
        <View
            {...props}
            className={className}
        />
    )
}

export type NotificationProps = {
    variant?: Variant
    leftAccent?: boolean
    rightAccent?: boolean
    bottomAccent?: boolean
    topAccent?: boolean
} & CoreViewProps

export const Notification = (props: NotificationProps) => {
    const { variant = 'default', leftAccent, rightAccent, bottomAccent, topAccent, ...rest } = props
    const className = classNames(
        {
            'f-notification': true,
            'f-row': true,
            'is-left-accent': leftAccent,
            'is-right-accent': rightAccent,
            'is-bottom-accent': bottomAccent,
            'is-top-accent': topAccent,
        },
        [props.className, getActionClass(variant)]
    )

    return (
        <View
            {...rest}
            role="alert"
            className={className}
        />
    )
}
