import React, { createElement } from 'react'
import { useId, View } from '..'
import { CoreViewProps } from '../types'
import { classNames } from '../helpers'

export type TableProps = {
    striped?: boolean
    lined?: boolean
    caption?: string
    captionPosition?: 'bottom' | 'top'
    stickyHeader?: boolean
    stickyColumn?: boolean
} & CoreViewProps

export const Table = (props: TableProps) => {
    const { striped = true, lined, caption, captionPosition, stickyHeader, stickyColumn, ...rest } = props
    const id = useId()
    const ariaDescribedby = caption ? id : props['aria-describedby']
    const className = classNames(
        {
            'f-table': true,
            'is-lined': lined,
            'is-striped': striped,
            'has-caption-bottom': captionPosition == 'bottom',
            'has-sticky-column': stickyColumn,
            'has-sticky-header': stickyHeader,
        },
        [props.className]
    )

    return (
        <View
            cellSpacing={0}
            cellPadding={0}
            {...rest}
            as="table"
            role="table"
            aria-describedby={ariaDescribedby}
            className={className}>
            {props.children}
            {caption && (
                <caption
                    className="f-table-caption"
                    id={id}>
                    {caption}
                </caption>
            )}
        </View>
    )
}

export type THeadProps = {} & any

export const THead = (props: THeadProps) => createElement('thead', props, props.children)

export type TBodyProps = {} & any

export const TBody = (props: THeadProps) => createElement('tbody', props, props.children)

export type ThProps = {
    colSpan?: number
    rowSpan?: number
} & any

export const Th = (props: ThProps) => {
    return (
        <th
            align="left"
            {...props}
            role="columnheader"
            aria-rowspan={props.rowSpan}
            aria-colspan={props.colSpan}
        />
    )
}

export type TrProps = {
    rowspan?: number
} & any

export const Tr = (props: TrProps) => {
    return (
        <tr
            align="left"
            {...props}
            aria-rowspan={props.rowspan}
            role="row"
        />
    )
}

export type TdProps = {
    colSpan?: number
    rowSpan?: number
} & any

export const Td = (props: TdProps) => {
    return (
        <td
            align="left"
            {...props}
            role="cell"
            aria-rowspan={props.rowSpan}
            aria-colspan={props.colSpan}
        />
    )
}
