import { CoreViewProps, Size, View, classNames } from '@fold-dev/core'
import React, { useContext, useMemo } from 'react'
import { isYearInsideRange } from '../helpers'
import { DateCell, DateCellProps } from './date-cell'
import { DateSelection } from './date-picker'
import { DatePickerContext } from './date-picker.context'

export type YearPickerProps = {
    size?: Size
    selection?: DateSelection[]
    disabled?: DateSelection[]
    date: Date
    renderYear?: any
    yearAmount?: number
    onChange?: any
    dateCellProps?: DateCellProps
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const YearPicker = (props: YearPickerProps) => {
    const {
        size,
        yearAmount = 12,
        selection = [],
        disabled = [],
        date = new Date(),
        renderYear,
        onChange,
        dateCellProps = {},
        ...rest
    } = props
    const { dateRangeSelection, setDateRangeSelection } = useContext(DatePickerContext)
    const className = classNames(
        {
            'f-months': true,
        },
        [props.className]
    )

    const years = useMemo(() => {
        return new Array(yearAmount).fill(null).map((_, index: number) => {
            const yearNumber = date.getFullYear() - yearAmount / 2 + index
            const year = new Date(yearNumber, date.getMonth(), date.getDate())
            const isToday = new Date().getFullYear() == yearNumber
            const isDisabled = disabled.reduce((acc, val) => acc || isYearInsideRange(year, val), false)
            const isSelected = selection.reduce((acc, val) => acc || isYearInsideRange(year, val), false)
            const isPending = selection.reduce((acc, val) => {
                const dateRange = val || new Date()
                const selectionStart = dateRange[0]
                return acc || (!dateRange[1] && selectionStart)
                    ? (year >= selectionStart && year <= dateRangeSelection) ||
                          (year <= selectionStart && year >= dateRangeSelection)
                    : false
            }, false)

            // get start and end booleans for selection
            const isStart = selection.reduce((acc, val) => acc || year.getFullYear() === val[0].getFullYear(), false)
            const isEnd = selection.reduce((acc, val) => acc || year.getFullYear() === val[1].getFullYear(), false)

            // TODO: add border radii (like days)
            return {
                date: year,
                today: isToday,
                disabled: isDisabled,
                pending: isPending,
                selected: isSelected,
                start: isStart,
                end: isEnd,
                year: yearNumber,
            }
        })
    }, [selection, disabled, dateRangeSelection, date])

    const handleMouseLeave = (e) => {
        setDateRangeSelection(selection[0] || null)
    }

    const handleChange = (year) => {
        if (!year.disabled && onChange) onChange(year.date)
    }

    const handleSelection = (year) => {
        if (!year.disabled) setDateRangeSelection(year.date)
    }

    return (
        <View
            {...rest}
            className={className}
            onMouseLeave={handleMouseLeave}>
            {years.map((year, index) => {
                return (
                    <DateCell
                        size={size}
                        key={index}
                        disabled={year.disabled}
                        selected={year.selected}
                        start={year.start}
                        end={year.end}
                        pending={year.pending}
                        today={year.today}
                        unavailable={false}
                        weekend={false}
                        onClick={(e) => handleChange(year)}
                        onMouseOver={() => handleSelection(year)}
                        {...dateCellProps}>
                        {renderYear ? renderYear(year.date) : year.year}
                    </DateCell>
                )
            })}
        </View>
    )
}
