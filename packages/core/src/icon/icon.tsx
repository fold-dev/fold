import React, { forwardRef, useMemo } from 'react'
import { classNames, windowObject } from '../helpers'
import { Size } from '../types'
import { FIWarning } from './icons'

export type IconProps = {
    size?: Size
    color?: string
    icon: any
} & any

export const Icon = forwardRef((props: IconProps, ref) => {
    const { size = 'md', color, icon, ...rest } = props
    const Component = icon
    const className = classNames(
        {
            'f-icon': true,
        },
        [props.className, size]
    )

    return (
        <Component
            {...rest}
            color={color}
            className={className}
            ref={ref}
        />
    )
})

export type FoldIcon = {
    [key: string]: any
}

const FOLD_ICONS = 'FOLD_ICONS'

export const getFoldIcons = () => windowObject[FOLD_ICONS] || {}

export const setFoldIcons = (foldIcons: FoldIcon) => {
    if (!windowObject[FOLD_ICONS]) windowObject[FOLD_ICONS] = {}
    windowObject[FOLD_ICONS] = {
        ...windowObject[FOLD_ICONS],
        ...foldIcons,
    }
}

export type IconLibProps = {
    icon: string
} & Omit<IconProps, 'icon'>

export const IconLib = forwardRef((props: any, ref) => {
    const { icon, ...rest } = props
    return (
        <Icon
            {...rest}
            icon={windowObject[FOLD_ICONS][icon] || FIWarning}
            ref={ref}
        />
    )
})
