import {
    Button,
    ButtonGroup,
    CoreViewProps,
    Size,
    View,
    classNames,
    getNumberArray,
    useFocus,
    waitForRender,
} from '../'
import React, { useEffect, useMemo, useRef } from 'react'
import { TimePickerColumn } from './time-picker-column'

export type TimePickerProps = {
    autoFocus?: boolean
    twelveHours?: boolean
    customHours?: number
    minutesDivider?: number
    secondsDivider?: number
    showHours?: boolean
    showMinutes?: boolean
    showSeconds?: boolean
    showAmPm?: boolean
    date?: Date
    size?: Size
    footer?: any
    onChange: (date: Date) => void
} & Omit<CoreViewProps, 'as' | 'onChange'>

export const TimePicker = (props: TimePickerProps) => {
    const {
        autoFocus = true,
        twelveHours,
        customHours = 24,
        minutesDivider = 5,
        secondsDivider = 5,
        showHours = true,
        showMinutes = true,
        showSeconds = true,
        showAmPm = true,
        size = 'md',
        date = new Date(),
        onChange,
        footer,
        ...rest
    } = props
    const containerRef = useRef(null)
    const { trapFocus } = useFocus()
    const { am, pm } = useMemo(() => {
        if (date.getHours() < 12) {
            return { am: true, pm: false }
        } else {
            return { am: false, pm: true }
        }
    }, [date])
    const { hours, minutes, seconds } = useMemo(() => {
        return {
            minutes: getNumberArray(60, minutesDivider),
            seconds: getNumberArray(60, secondsDivider),
            hours: twelveHours ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : getNumberArray(customHours),
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

    const get12HoursSelected = () => {
        if (twelveHours && hour == 12) {
            return 12
        }
        if (twelveHours && hour == 0) {
            return 12
        } else {
            return twelveHours && pm ? hour - 12 : hour
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

    useEffect(() => {
        waitForRender(() => trapFocus(containerRef.current), 10)
    }, [autoFocus])

    return (
        <View
            {...rest}
            row
            ref={containerRef}
            alignItems="flex-start"
            className={className}>
            {showHours && (
                <TimePickerColumn
                    size={size}
                    items={hours}
                    selected={get12HoursSelected()}
                    onSelect={(value) => handleTimeChange('hour', twelveHours && pm ? value + 12 : value)}
                />
            )}

            {showMinutes && (
                <TimePickerColumn
                    size={size}
                    items={minutes}
                    selected={minute}
                    onSelect={(value) => handleTimeChange('minute', value)}
                />
            )}

            {showSeconds && (
                <TimePickerColumn
                    size={size}
                    items={seconds}
                    selected={second}
                    onSelect={(value) => handleTimeChange('second', value)}
                />
            )}

            {showAmPm && (
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
