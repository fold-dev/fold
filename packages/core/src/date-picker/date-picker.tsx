import { Button, CoreViewProps, IconLib, Size, View, classNames, useFocus, waitForRender } from '@fold-dev/core'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FDate } from '../helpers'
import { DateCellProps } from './date-cell'
import { DatePickerMonth, DatePickerMonthProps } from './date-picker-month'
import { DatePickerWeekdays, DatePickerWeekdaysProps } from './date-picker-weekdays'
import { MonthPicker, MonthPickerProps } from './month-picker'
import { YearPicker, YearPickerProps } from './year-picker'

export type DateSelection = Date[]

export type DatePickerProps = {
    autoFocus?: boolean
    size?: Size
    selectWeek?: boolean
    selection?: DateSelection[]
    disabled?: DateSelection[]
    weekendDays?: number[]
    weekdays?: string[]
    defaultDate: Date
    offsetDays?: number
    renderDay?: any
    onChange?: any
    dateCellProps?: DateCellProps
    yearAmount?: number
    defaultLevel?: 'days' | 'months' | 'years'
    lockLevel?: boolean
    panels?: number
    weekdaysProps?: DatePickerWeekdaysProps
    monthProps?: Omit<DatePickerMonthProps, 'date'>
    monthsProps?: Omit<MonthPickerProps, 'date'>
    yearsProps?: Omit<YearPickerProps, 'date'>
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const DatePicker = (props: DatePickerProps) => {
    const {
        autoFocus = true,
        selectWeek,
        size,
        renderDay,
        selection = [],
        disabled = [],
        weekendDays = [0, 6],
        weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
        defaultDate = new Date(),
        offsetDays = 0,
        onChange,
        dateCellProps = {},
        yearAmount = 12,
        defaultLevel = 'days',
        lockLevel,
        panels = 1,
        weekdaysProps = {},
        monthProps = {},
        monthsProps = {},
        yearsProps = {},
        ...rest
    } = props
    const containerRef = useRef(null)
    const { trapFocus } = useFocus()
    const [level, setLevel] = useState<'days' | 'months' | 'years'>(defaultLevel)
    const [date, setDate] = useState(defaultDate)
    const dates = useMemo(() => {
        return new Array(panels).fill(date).map((d, i) => {
            const index = panels == 1 ? i : i - 1
            return FDate(d).add(index, 'month')
        })
    }, [date, panels])
    const className = classNames(
        {
            'f-date-picker': true,
            'f-col': true,
        },
        [props.className]
    )

    const handleForwardClick = () => {
        switch (level) {
            case 'days':
                return setDate(FDate(date).add(1, 'month'))
            case 'months':
                return setDate(FDate(date).add(1, 'year'))
            case 'years':
                return setDate(FDate(date).add(yearAmount, 'year'))
        }
    }

    const handleBackwardClick = () => {
        switch (level) {
            case 'days':
                return setDate(FDate(date).subtract(1, 'month'))
            case 'months':
                return setDate(FDate(date).subtract(1, 'year'))
            case 'years':
                return setDate(FDate(date).subtract(yearAmount, 'year'))
        }
    }

    const getTitleText = (date: Date) => {
        switch (level) {
            case 'days':
                return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
            case 'months':
                return date.getFullYear()
            case 'years':
                return 'Years'
        }
    }

    const handleMonthChange = (date: Date) => {
        setDate(date)
        setLevel('days')
    }

    const handleYearChange = (date: Date) => {
        setDate(date)
        setLevel('months')
    }

    const handleTitleClick = () => {
        if (lockLevel) return
        switch (level) {
            case 'days':
                return setLevel('months')
            case 'months':
                return setLevel('years')
            default:
                return null
        }
    }

    return (
        <View
            {...rest}
            ref={containerRef}
            className={className}>
            <View
                row
                className="f-date-picker__titles f-row">
                <Button
                    subtle
                    onClick={handleBackwardClick}>
                    <IconLib icon="chevron-left" />
                </Button>
                <Button
                    subtle
                    onClick={handleTitleClick}
                    flex={1}
                    fontWeight={600}
                    colorToken="text"
                    className="f-date-picker__title">
                    {level != 'days' ? <span className="f-flexer">{getTitleText(date)}</span> : null}
                    {level == 'days' &&
                        dates.map((date1: Date, index: number) => (
                            <span
                                key={index}
                                className="f-date-picker__title-text"
                                style={{
                                    // TODO: do this better
                                    // 52 is the apx. width of the < > buttons
                                    paddingLeft: index != 0 ? 52 + 10 : 0,
                                    paddingRight: index != dates.length - 1 ? 52 + 10 : 0,
                                }}>
                                {getTitleText(date1)}
                            </span>
                        ))}
                </Button>
                <Button
                    subtle
                    onClick={handleForwardClick}>
                    <IconLib icon="chevron-right" />
                </Button>
            </View>

            <View className="f-date-picker__panels">
                {level == 'days' &&
                    dates.map((date1: Date, index: number) => (
                        <View
                            key={index}
                            column
                            className="f-date-picker__panel">
                            <DatePickerWeekdays
                                size={size}
                                weekdays={weekdays}
                                {...weekdaysProps}
                            />
                            <DatePickerMonth
                                date={date1}
                                weekendDays={weekendDays}
                                offsetDays={offsetDays}
                                dateCellProps={dateCellProps}
                                selection={selection}
                                onChange={onChange}
                                disabled={disabled}
                                renderDay={renderDay}
                                size={size}
                                selectWeek={selectWeek}
                                {...monthProps}
                            />
                        </View>
                    ))}

                {level == 'months' && (
                    <MonthPicker
                        date={date}
                        onChange={handleMonthChange}
                        {...monthsProps}
                    />
                )}

                {level == 'years' && (
                    <YearPicker
                        date={date}
                        onChange={handleYearChange}
                        {...yearsProps}
                    />
                )}
            </View>
        </View>
    )
}
