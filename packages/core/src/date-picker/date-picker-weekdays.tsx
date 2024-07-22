import { CoreViewProps, Size, Text, View, classNames } from '@fold-dev/core'
import React from 'react'

export type DatePickerWeekdaysProps = {
    size?: Size
    weekdays?: string[]
} & CoreViewProps

export const DatePickerWeekdays = (props: DatePickerWeekdaysProps) => {
    const { size, weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'], ...rest } = props
    const className = classNames(
        {
            'f-weekdays': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}>
            {weekdays.map((weekday, index) => (
                <Text
                    as="span"
                    size={size}
                    key={index}>
                    {weekday.slice(0, 3)}
                </Text>
            ))}
        </View>
    )
}
