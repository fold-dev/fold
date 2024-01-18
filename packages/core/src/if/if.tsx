import React from 'react'

export type IfProps = {
    if: boolean
    children?: any
}

export const If = (props: IfProps) => {
    if (!!props.if) {
        return props.children
    } else {
        return null
    }
}
