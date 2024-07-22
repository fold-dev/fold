import React, { useContext, useMemo } from 'react'
import { CoreViewProps, Size, View, classNames } from '../'
import { FDate, getStartAndEndOfWeek, isDayInsideRange } from '../helpers'
import { DateCell, DateCellProps } from './date-cell'
import { DateSelection } from './date-picker'
import { DatePickerContext } from './date-picker.context'

export type DatePickerMonthProps = {
    size?: Size
    selectWeek?: boolean
    selection?: DateSelection[]
    disabled?: DateSelection[]
    weekendDays?: number[]
    date?: Date
    offsetDays?: number
    renderDay?: any
    onChange?: any
    dateCellProps?: DateCellProps
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const DatePickerMonth = (props: DatePickerMonthProps) => {
    const {
        selectWeek,
        size,
        renderDay,
        selection = [],
        disabled = [],
        weekendDays = [0, 6],
        date = new Date(),
        offsetDays = 0,
        onChange,
        dateCellProps = {},
        ...rest
    } = props
    const { dateRangeSelection, setDateRangeSelection, pendingRowSelection, setPendingRowSelection } =
        useContext(DatePickerContext)
    const className = classNames(
        {
            'f-month': true,
        },
        [props.className]
    )

    const days = useMemo(() => {
        const monthDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const weekdayOfFirstDay = monthDay.getDay() - offsetDays
        const days = []

        for (let dayNumber = 0; dayNumber < 42; dayNumber++) {
            if (dayNumber === 0 && weekdayOfFirstDay === 0) {
                monthDay.setDate(monthDay.getDate() - 7)
            } else if (dayNumber === 0) {
                monthDay.setDate(monthDay.getDate() + (dayNumber - weekdayOfFirstDay))
            } else {
                monthDay.setDate(monthDay.getDate() + 1)
            }

            const day = new Date(monthDay)
            const isDisabled = disabled.reduce((acc, val) => acc || isDayInsideRange(day, val), false)
            const isSelected = selection.reduce((acc, val) => acc || isDayInsideRange(day, val), false)

            // calculates whether a user is selecting a date range
            const isPending = selectWeek
                ? day >= pendingRowSelection[0] && day <= pendingRowSelection[1]
                : selection.reduce((acc, val) => {
                      const dateRange = val || new Date()
                      const selectionStart = dateRange[0]
                      return acc || (!dateRange[1] && selectionStart)
                          ? (day >= selectionStart && day <= dateRangeSelection) ||
                                (day <= selectionStart && day >= dateRangeSelection)
                          : false
                  }, false)

            // get start and end booleans for selection
            const isStart = selection.reduce((acc, val) => acc || FDate(day).isSame(val[0]), false)
            const isEnd = selection.reduce((acc, val) => acc || FDate(day).isSame(val[1] || val[0]), false)

            days.push({
                date: day,
                today: FDate(day).isSame(new Date()),
                weekend: weekendDays.includes(day.getDay()),
                disabled: isDisabled,
                unavailable: day.getMonth() !== date.getMonth(),
                pending: isPending && day.getMonth() === date.getMonth(),
                selected: isSelected,
                start: isStart,
                end: isEnd,
            })
        }

        return days
    }, [selection, disabled, date, dateRangeSelection, pendingRowSelection])

    const handleMouseLeave = (e) => {
        setPendingRowSelection([])
        setDateRangeSelection(selection[0] || null)
    }

    const handleChange = (day) => {
        const isUnavailable = day.date.getMonth() !== date.getMonth()
        const isDisabled = day.disabled
        if (!isUnavailable && !isDisabled && onChange) {
            onChange(selectWeek ? [...pendingRowSelection] : day.date)
        }
    }

    const handleSelection = (day, index) => {
        if (selectWeek) {
            const { start, end } = getStartAndEndOfWeek(index)
            setPendingRowSelection([new Date(days[start].date), new Date(days[end].date)])
        } else {
            setDateRangeSelection(day.date)
        }
    }

    return (
        <View
            {...rest}
            className={className}
            onMouseLeave={handleMouseLeave}>
            {days.map((day, index) => {
                return (
                    <DateCell
                        key={index}
                        disabled={day.disabled}
                        selected={day.selected}
                        start={day.start}
                        end={day.end}
                        pending={day.pending}
                        unavailable={day.unavailable}
                        today={day.today}
                        weekend={day.weekend}
                        onClick={(e) => handleChange(day)}
                        onMouseOver={() => handleSelection(day, index)}
                        {...dateCellProps}>
                        {renderDay ? renderDay(day.date) : day.date.getDate()}
                    </DateCell>
                )
            })}
        </View>
    )
}
