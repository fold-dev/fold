import React from 'react'
import { CommonProps, classNames } from '../'

export type DateCellProps = {
    disabled?: boolean
    unavailable?: boolean
    selected?: boolean
    today?: boolean
    pending?: boolean
    pendingStart?: boolean
    pendingEnd?: boolean
    weekend?: boolean
    start?: boolean
    end?: boolean
    onClick?: (e) => void
    onMouseOver?: (e) => void
} & CommonProps

export const DateCell = (props: DateCellProps) => {
    const { disabled, selected, weekend, unavailable, pending, today, start, end, ...rest } = props
    const className = classNames(
        {
            'f-date-cell': true,
            'f-row': true,
            'f-buttonize': true,
            'is-selected': selected,
            'is-unavailable': unavailable,
            'is-weekend': weekend,
            'is-pending': pending,
            'is-disabled': disabled,
            'is-today': today,
            'is-start': start,
            'is-end': end,
        },
        [props.className]
    )

    return (
        <button
            {...rest}
            className={className}>
            {props.children}
        </button>
    )
}
