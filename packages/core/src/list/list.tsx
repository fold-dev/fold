import { CoreViewProps, ListStyleType } from '../types'
import { classNames } from '../helpers'
import React, { useMemo } from 'react'
import { View } from '..'

export type LiProps = {} & CoreViewProps

export const Li = (props: LiProps) => {
    const className = classNames(
        {
            'f-li': true,
        },
        [props.className]
    )

    return (
        <View
            {...props}
            as="li"
            className={className}
        />
    )
}

export type ListProps = {
    as?: 'ul' | 'ol'
    type?: ListStyleType
    bullet?: string
} & CoreViewProps

export const List = (props: ListProps) => {
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
            as={as}
            className={className}
            style={styles}
        />
    )
}
