import React, { forwardRef } from 'react'
import { View } from '..'
import { CoreViewProps } from '../types'
import { classNames } from '../helpers'

export type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type HeadingProps = {
    jumbo?: boolean
    huge?: boolean
    as?: Headings
} & CoreViewProps

export const Heading = forwardRef((props: HeadingProps, ref) => {
    const { jumbo, huge, as = 'h1', ...rest } = props
    const className = classNames(
        {
            'f-heading': true,
            'is-huge': props.huge,
            'is-jumbo': props.jumbo,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            as={as}
            className={className}
            ref={ref}
        />
    )
})
