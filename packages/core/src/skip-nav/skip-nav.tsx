import { Color, CoreViewProps, Size, Variant } from '../types'
import React from 'react'
import { Button, ButtonProps } from '..'

export type SkipNavProps = {} & ButtonProps

export const SkipNav = (props: SkipNavProps) => {
    return (
        <Button
            {...props}
            as="a"
            href="#f-skip-nav-main"
            className="f-skip-nav"
        />
    )
}

export type SkipNavMainProps = {}

export const SkipNavMain = (props: SkipNavMainProps) => {
    return <div id="f-skip-nav-main" />
}
