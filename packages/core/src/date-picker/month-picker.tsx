import { CoreViewProps, Size, View, classNames, getKey } from '../'
import React, { useContext, useMemo } from 'react'
import { isMonthInsideRange } from '../helpers'
import { DateCell, DateCellProps } from './date-cell'
import { DateSelection } from './date-picker'
import { DatePickerContext } from './date-picker.context'

export type MonthPickerProps = {
    size?: Size
    selection?: DateSelection[]
    disabled?: DateSelection[]
    date: Date
    renderMonth?: any
    monthNames?: any[]
    onChange?: any
    dateCellProps?: DateCellProps
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const MonthPicker = (props: MonthPickerProps) => {
    const {
        size,
        selection = [],
        disabled = [],
        date = new Date(),
        renderMonth,
        monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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

    const months = useMemo(() => {
        return monthNames.map((monthName: string, index: number) => {
            const month = new Date(date.getFullYear(), index, date.getDate())
            const isToday = new Date().getMonth() == month.getMonth() && new Date().getFullYear() == month.getFullYear()
            const isDisabled = disabled.reduce((acc, val) => acc || isMonthInsideRange(month, val), false)
            const isSelected = selection.reduce((acc, val) => acc || isMonthInsideRange(month, val), false)
            const isPending = selection.reduce((acc, val) => {
                const dateRange = val || new Date()
                const selectionStart = dateRange[0]
                return acc || (!dateRange[1] && selectionStart)
                    ? (month >= selectionStart && month <= dateRangeSelection) ||
                          (month <= selectionStart && month >= dateRangeSelection)
                    : false
            }, false)

            // get start and end booleans for selection
            const isStart = selection.reduce(
                (acc, val) =>
                    acc || (month.getMonth() === val[0].getMonth() && month.getFullYear() === val[0].getFullYear()),
                false
            )
            const isEnd = selection.reduce(
                (acc, val) =>
                    acc || (month.getMonth() === val[1].getMonth() && month.getFullYear() === val[1].getFullYear()),
                false
            )

            return {
                date: month,
                today: isToday,
                disabled: isDisabled,
                pending: isPending,
                selected: isSelected,
                start: isStart,
                end: isEnd,
                name: monthName,
                month: index,
            }
        })
    }, [monthNames, selection, disabled, dateRangeSelection, date])

    const handleMouseLeave = (e) => {
        setDateRangeSelection(selection[0] || null)
    }

    const handleChange = (month) => {
        if (!month.disabled && onChange) onChange(month.date)
    }

    const handleSelection = (month) => {
        if (!month.disabled) setDateRangeSelection(month.date)
    }

    const handleKeyDown = (e) => {
        console.log('here', e.key)
    }

    return (
        <View
            {...rest}
            className={className}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}>
            {months.map((month, index) => {
                return (
                    <DateCell
                        key={index}
                        disabled={month.disabled}
                        selected={month.selected}
                        start={month.start}
                        end={month.end}
                        pending={month.pending}
                        today={month.today}
                        unavailable={false}
                        weekend={false}
                        onClick={(e) => handleChange(month)}
                        onMouseOver={() => handleSelection(month)}
                        {...dateCellProps}>
                        {renderMonth ? renderMonth(month.date) : month.name}
                    </DateCell>
                )
            })}
        </View>
    )
}
