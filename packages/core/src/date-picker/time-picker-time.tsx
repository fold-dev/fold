import { CoreViewProps, Size, Text, classNames } from '../'
import React from 'react'

export type TimePickerTimeProps = {
    size: Size
    value: number
    selected: boolean
    onSelect: any
} & CoreViewProps

export const TimePickerTime = (props: TimePickerTimeProps) => {
    const { size, value, selected, onSelect, ...rest } = props
    const className = classNames({
        'f-time-picker-time': true,
        'f-row': true,
        'f-buttonize': true,
        'is-selected': selected,
    })

    return (
        <div
            {...rest}
            className={className}
            onClick={onSelect}>
            <Text size={size}>{value}</Text>
        </div>
    )
}
