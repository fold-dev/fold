import { CoreViewProps, Size, View, classNames, mergeRefs, useFocus, waitForRender } from '@fold-dev/core'
import React, { ReactElement, forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { FDate } from '../helpers'
import { DateCellProps } from './date-cell'
import { DateSelection } from './date-picker'
import { DatePickerMonth, DatePickerMonthProps } from './date-picker-month'
import { DatePickerWeekdaysProps } from './date-picker-weekdays'

export type ScrollingDatePickerProps = {
    autoFocus?: boolean
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
    weekdaysProps?: DatePickerWeekdaysProps
    monthProps?: Omit<DatePickerMonthProps, 'date'>
    monthNames?: string[]
    monthTitle: (date: Date) => ReactElement
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
        autoFocus = true,
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
    const { trapFocus } = useFocus()
    const date = useMemo(() => new Date(defaultDate.getFullYear(), defaultDate.getMonth(), 15), [defaultDate])
    const lockedRef = useRef(null)
    const containerRef = useRef(null)
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

        const offsetHeight = containerRef.current.scrollHeight - containerRef.current.scrollTop
        const loadTop = containerRef.current.scrollTop <= scrollThreshold
        const loadBottom = containerRef.current.offsetHeight >= offsetHeight - scrollThreshold

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
        setMonths([FDate(date).subtract(1, 'month'), new Date(date), FDate(date).add(1, 'month')])
        waitForRender(() => {
            const { offsetHeight } = containerRef.current
            containerRef.current.scrollTo({ top: offsetHeight })
            setTimeout(() => (lockedRef.current = false), 100)
        })
    }, [date])

    return (
        <View
            {...rest}
            width={width}
            height={height}
            className={className}
            ref={mergeRefs([containerRef, ref])}
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
                        {monthTitle(month)}
                        <DatePickerMonth
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
