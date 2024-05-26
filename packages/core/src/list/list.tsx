import { CoreViewProps, ListStyleType } from '../types'
import { classNames } from '../helpers'
import React, { forwardRef, useMemo } from 'react'
import { View } from '..'

export type LiProps = {} & CoreViewProps

export const Li = forwardRef((props: LiProps, ref) => {
    const className = classNames(
        {
            'f-li': true,
        },
        [props.className]
    )

    return (
        <View
            {...props}
            ref={ref}
            as="li"
            className={className}
        />
    )
})

export type ListProps = {
    as?: 'ul' | 'ol'
    type?: ListStyleType
    bullet?: string
} & CoreViewProps

export const List = forwardRef((props: ListProps, ref) => {
    const { as, bullet = null, type = 'default', style = {}, ...rest } = props
    const className = classNames(
        {
            'f-list': true,
            'is-ol': as == 'ol',
            'is-ul': as == 'ul',
        },
        [props.className]
    )
    const styles = useMemo(
        () => ({
            ...style,
            'listStyleType': type,
            '--f-list-bullet': props.bullet ? `"${props.bullet} "` : null,
        }),
        [style, type, bullet]
    )

    return (
        <View
            {...rest}
            ref={ref}
            as={as}
            className={className}
            style={styles}
        />
    )
})
