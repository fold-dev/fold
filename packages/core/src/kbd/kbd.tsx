import React from 'react'
import { View } from '../'
import { CoreViewProps } from '../types'

export type KbdProps = CoreViewProps

export const Kbd = (props: KbdProps) => {
    return (
        <View
            as="kbd"
            className="f-kbd"
            {...props}
        />
    )
}
