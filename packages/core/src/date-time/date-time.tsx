import React, {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    FDate,
    classNames,
    getKey,
    getNumberArray,
    getStartAndEndOfWeek,
    isDayInsideRange,
    isMonthInsideRange,
    isYearInsideRange,
    mergeRefs,
    scrollToCenter,
} from '../helpers'
import { Button, ButtonGroup, IconLib, Stack, Text, TextProps, View, useResize } from '../index'
import { CoreViewProps, Size } from '../types'

/**
 * time picker
 */

export type TimePickerProps = {
    twelveHours?: boolean
    customHours?: number
    hideAmPm?: boolean
    date?: Date
    size?: Size
    footer?: any
    onChange: (date: Date) => void
} & Omit<CoreViewProps, 'as' | 'onChange'>

export const TimePicker = (props: TimePickerProps) => {
    const { twelveHours, customHours = 24, hideAmPm, size = 'md', date = new Date(), onChange, footer, ...rest } = props
    const { am, pm } = useMemo(() => {
        if (date.getHours() < 12) {
            return { am: true, pm: false }
        } else {
            return { am: false, pm: true }
        }
    }, [date])
    const { hours, minutes, seconds } = useMemo(() => {
        return {
            minutes: getNumberArray(60),
            seconds: getNumberArray(60),
            hours: twelveHours ? getNumberArray(12).map((h) => h + 1) : getNumberArray(customHours),
        }
    }, [twelveHours])
    const { hour, minute, second } = useMemo(() => {
        return {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        }
    }, [date])
    const className = classNames(
        {
            'f-time-picker': true,
            'f-col': true,
        },
        [size, props.className]
    )

    const get12Hours = () => {
        const index = (pm ? hour - 12 : hour) - 1

        if (index == -1) {
            return 11
        } else {
            return index
        }
    }

    const handleTimeChange = (part: 'hour' | 'minute' | 'second', value) => {
        switch (part) {
            case 'hour':
                return onChange(new Date(date.setHours(value)))
            case 'minute':
                return onChange(new Date(date.setMinutes(value)))
            case 'second':
                return onChange(new Date(date.setSeconds(value)))
        }
    }

    const handleAmChange = (e) => {
        e.preventDefault()
        const hours = date.getHours()
        if (hours >= 12) handleTimeChange('hour', hours - 12)
    }

    const handlePmChange = (e) => {
        e.preventDefault()
        const hours = date.getHours()
        if (hours < 12) handleTimeChange('hour', hours + 12)
    }

    return (
        <View
            {...rest}
            className={className}
            row
            alignItems="flex-start">
            <TimePickerColumn
                size={size}
                items={hours}
                selected={twelveHours ? get12Hours() : hour}
                onSelect={(value) => handleTimeChange('hour', twelveHours ? value + 1 : value)}
            />
            <TimePickerColumn
                size={size}
                items={minutes}
                selected={minute}
                onSelect={(value) => handleTimeChange('minute', value)}
            />
            <TimePickerColumn
                size={size}
                items={seconds}
                selected={second}
                onSelect={(value) => handleTimeChange('second', value)}
            />

            {!hideAmPm && (
                <div className="f-time-picker__ampm">
                    <ButtonGroup
                        direction="vertical"
                        width="100%">
                        <Button
                            onClick={handleAmChange}
                            active={am}>
                            AM
                        </Button>
                        <Button
                            onClick={handlePmChange}
                            active={pm}>
                            PM
                        </Button>
                    </ButtonGroup>
                    {footer}
                </div>
            )}
        </View>
    )
}

export type TimePickerColumnProps = {
    size?: Size
    items: number[]
    selected: number
    onSelect: any
} & CoreViewProps

export const TimePickerColumn = (props: TimePickerColumnProps) => {
    const { size = 'md', items, selected, onSelect, ...rest } = props
    const ref = useRef(null)
    const dimensions = useResize(ref.current)
    const className = classNames({
        'f-time-picker-column': true,
        'f-scrollbar': true,
    })

    const handleKeyDown = (e) => {
        const { isUp, isDown, isEnter } = getKey(e)

        if (isUp || isDown || isEnter) {
            e.preventDefault()
            e.stopPropagation()

            if (isUp) onSelect(selected == 0 ? items.length - 1 : selected - 1)
            if (isDown) onSelect(selected == items.length - 1 ? 0 : selected + 1)
        }
    }

    useEffect(() => {
        scrollToCenter(ref.current.children[selected])
    }, [items, selected, dimensions])

    return (
        <View
            {...rest}
            ref={ref}
            tabIndex={0}
            className={className}
            onKeyDown={handleKeyDown}>
            {items.map((item, index) => {
                return (
                    <TimePickerTime
                        key={index}
                        value={item}
                        size={size}
                        selected={selected == index}
                        onSelect={() => onSelect(index)}
                    />
                )
            })}
        </View>
    )
}

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

/**
 * pending date provider
 */

export type DateRangeSelection = Date

export type PendingRowSelection = Date[]

export const DateRangeContext = createContext<any>({
    dateRangeSelection: null,
    setDateRangeSelection: (day) => null,
    pendingRowSelection: null,
    setPendingRowSelection: (days) => null,
})

export const DateRangeProvider = (props: any) => {
    const [dateRangeSelection, setDateRangeSelection] = useState<DateRangeSelection>(new Date())
    const [pendingRowSelection, setPendingRowSelection] = useState<PendingRowSelection>([new Date(), new Date()])

    return (
        <DateRangeContext.Provider
            value={{
                dateRangeSelection,
                setDateRangeSelection,
                pendingRowSelection,
                setPendingRowSelection,
            }}>
            {props.children}
        </DateRangeContext.Provider>
    )
}

/**
 * date cell - used for day/month/year blocks
 */

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
} & TextProps

export const DateCell = (props: DateCellProps) => {
    const { 
        disabled, 
        selected, 
        weekend, 
        unavailable, 
        pending, 
        pendingStart,
        pendingEnd,
        today, 
        start, 
        end, 
        ...rest 
    } = props
    const className = classNames(
        {
            'f-date-cell': true,
            'f-row': true,
            'f-buttonize': true,
            'is-selected': selected && !unavailable,
            'is-unavailable': unavailable,
            'is-weekend': weekend,
            'is-pending': pending,
            'is-pending-start': pendingStart,
            'is-pending-end': pendingEnd,
            'is-disabled': disabled,
            'is-today': today,
            'is-start': start,
            'is-end': end,
        },
        [props.className]
    )

    return (
        <Text
            as="span"
            {...rest}
            className={className}>
            {props.children}
        </Text>
    )
}

/**
 * weekdays
 */

export type WeekdaysProps = {
    size?: Size
    weekdays?: string[]
} & CoreViewProps

export const Weekdays = (props: WeekdaysProps) => {
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

export type DateSelection = Date[]

/**
 * (month) day picker
 */

export type MonthProps = {
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

export const Month = (props: MonthProps) => {
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
    const { dateRangeSelection, setDateRangeSelection, pendingRowSelection, setPendingRowSelection } = useContext(DateRangeContext)
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

            // get start and end booleans for selection / pending
            const isStart = selection.reduce((acc, val) => acc ||  FDate(day).isSame(val[0]), false)
            const isEnd = selection.reduce((acc, val) => acc ||  FDate(day).isSame(val[1] || val[0]), false)
            const isPendingStart = false // pendingRowSelection[0] ?  FDate(day).isSame(pendingRowSelection[0]) : false
            const isPendingEnd = false // pendingRowSelection[1] ?  FDate(day).isSame(pendingRowSelection[1]) : false

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
                pendingStart: isPendingStart,
                pendingEnd: isPendingEnd,
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
                        size={size}
                        key={index}
                        disabled={day.disabled}
                        selected={day.selected}
                        start={day.start}
                        end={day.end}
                        pending={day.pending}
                        pendingStart={day.pendingStart}
                        pendingEnd={day.pendingEnd}
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

/**
 * month picker
 */

export type MonthsProps = {
    size?: Size
    selection?: DateSelection[]
    disabled?: DateSelection[]
    date: Date
    renderMonth?: any
    monthNames?: any[]
    onChange?: any
    dateCellProps?: DateCellProps
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const Months = (props: MonthsProps) => {
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
    const { dateRangeSelection, setDateRangeSelection } = useContext(DateRangeContext)
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

            // TODO: add border radii (like days)
            return {
                date: month,
                today: isToday,
                disabled: isDisabled,
                pending: isPending,
                selected: isSelected,
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

    return (
        <View
            {...rest}
            className={className}
            onMouseLeave={handleMouseLeave}>
            {months.map((month, index) => {
                return (
                    <DateCell
                        size={size}
                        key={index}
                        disabled={month.disabled}
                        selected={month.selected}
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

/**
 * year picker
 */

export type YearsProps = {
    size?: Size
    selection?: DateSelection[]
    disabled?: DateSelection[]
    date: Date
    renderYear?: any
    yearAmount?: number
    onChange?: any
    dateCellProps?: DateCellProps
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const Years = (props: YearsProps) => {
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
    const { dateRangeSelection, setDateRangeSelection } = useContext(DateRangeContext)
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

            // TODO: add border radii (like days)
            return {
                date: year,
                today: isToday,
                disabled: isDisabled,
                pending: isPending,
                selected: isSelected,
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

/**
 * date picker
 */

export type DatePickerProps = {
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
    weekdaysProps?: WeekdaysProps
    monthProps?: Omit<MonthProps, 'date'>
    monthsProps?: Omit<MonthsProps, 'date'>
    yearsProps?: Omit<YearsProps, 'date'>
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const DatePicker = (props: DatePickerProps) => {
    const {
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
            className={className}>
            <View
                row
                className="f-date-picker__titles">
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
                    className="f-date-picker__title f-row">
                    {level != 'days' ? getTitleText(date) : null}
                    {level == 'days' &&
                        dates.map((date1: Date, index: number) => (
                            <span
                                key={index}
                                className="f-date-picker__title-text"
                                style={{
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

            <View
                row
                className="f-date-picker__panels">
                {level == 'days' &&
                    dates.map((date1: Date, index: number) => (
                        <View
                            key={index}
                            column
                            className="f-date-picker__panel">
                            <Weekdays
                                size={size}
                                weekdays={weekdays}
                                {...weekdaysProps}
                            />
                            <Month
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
                    <Months
                        date={date}
                        onChange={handleMonthChange}
                        {...monthsProps}
                    />
                )}

                {level == 'years' && (
                    <Years
                        date={date}
                        onChange={handleYearChange}
                        {...yearsProps}
                    />
                )}
            </View>
        </View>
    )
}

/**
 * scrolling date picker
 */

export type ScrollingDatePickerProps = {
    width?: number
    height?: number
    scrollThreshold?: number
    size?: Size
    selection?: DateSelection[]
    disabled?: DateSelection[]
    defaultDate?: Date
    onChange?: any
    renderDay?: any
    dateCellProps?: DateCellProps
    weekdaysProps?: WeekdaysProps
    monthProps?: Omit<MonthProps, 'date'>
    monthNames?: string[]
    monthTitle: (date: Date) => string
} & Omit<CoreViewProps, 'onChange' | 'disabled'>

export const useScrollingDatePicker = () => {
    const goToToday = (el) => {
        const { parentNode } = el.querySelector('*[data-today="true"]')
        if (!parentNode) return
        const { offsetTop } = parentNode
        el.scrollTo({ top: offsetTop })
    }

    return { goToToday }
}

export const ScrollingDatePicker = forwardRef((props: ScrollingDatePickerProps, ref) => {
    const {
        width = '100%',
        height = 250,
        scrollThreshold = 100,
        size,
        selection = [],
        disabled = [],
        defaultDate = new Date(),
        onChange,
        renderDay,
        dateCellProps = {},
        weekdaysProps = {},
        monthProps = {},
        monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        monthTitle,
        ...rest
    } = props
    const date = useMemo(() => new Date(defaultDate.getFullYear(), defaultDate.getMonth(), 15), [defaultDate])
    const lockedRef = useRef(null)
    const calendarsRef = useRef(null)
    const [months, setMonths] = useState<Date[]>([
        FDate(date).subtract(1, 'month'),
        new Date(date),
        FDate(date).add(1, 'month'),
    ])
    const className = classNames(
        {
            'f-scrolling-date-picker': true,
            'f-scrollbar': true,
        },
        [props.className]
    )

    const handleScroll = (e) => {
        if (lockedRef.current) return

        const offsetHeight = calendarsRef.current.scrollHeight - calendarsRef.current.scrollTop
        const loadTop = calendarsRef.current.scrollTop <= scrollThreshold
        const loadBottom = calendarsRef.current.offsetHeight >= offsetHeight - scrollThreshold

        if (loadTop) {
            const earliestMonth: Date = months[0]
            const previousMonth = FDate(earliestMonth).subtract(1, 'month')
            setMonths([previousMonth, ...months])
        }

        if (loadBottom) {
            const latestMonth = months[months.length - 1]
            const nextMonth = FDate(latestMonth).add(1, 'month')
            setMonths([...months, nextMonth])
        }
    }

    useLayoutEffect(() => {
        const { offsetHeight } = calendarsRef.current
        calendarsRef.current.scrollTo({ top: offsetHeight })
        setTimeout(() => (lockedRef.current = false), 100)
    }, [date])

    return (
        <View
            {...rest}
            width={width}
            height={height}
            className={className}
            ref={mergeRefs([calendarsRef, ref])}
            onScroll={handleScroll}>
            {months.map((month: Date, index: number) => {
                const uuid = month.getMonth() + '-' + month.getFullYear()
                const today =
                    new Date().getMonth() == month.getMonth() && new Date().getFullYear() == month.getFullYear()

                return (
                    <div
                        key={uuid}
                        className="f-col"
                        style={{ height, width: '100%' }}>
                        <Text
                            fontWeight={600}
                            p={5}
                            size={size}
                            width="100%">
                            {monthTitle(month)}
                        </Text>
                        <Month
                            width="100%"
                            flex={1}
                            id={uuid}
                            size={size}
                            date={month}
                            selection={selection}
                            onChange={onChange}
                            disabled={disabled}
                            data-today={today ? 'true' : 'false'}
                            dateCellProps={dateCellProps}
                            renderDay={renderDay}
                            {...monthProps}
                        />
                    </div>
                )
            })}
        </View>
    )
})
