import React from 'react'
import { View } from '..'
import { classNames } from '../helpers'
import { CoreViewProps } from '../types'

export type HiddenProps = {
    /**
     * DOM element name
     * @defaultValue `div`
     **/
    as?: string
} & CoreViewProps

export const Hidden = (props: HiddenProps) => {
    const { as = 'span', ...rest } = props
    const className = classNames(
        {
            'f-hidden': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            as={as}
            className={className}
            aria-hidden={true}
        />
    )
}
