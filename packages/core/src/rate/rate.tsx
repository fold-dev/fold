import { CoreViewProps, Size } from '../types'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { FIStar, useTheme, View } from '../'
import { classNames, getBoundingClientRect, getPercent } from '../helpers'
import { Icon, IconLib } from '../icon/icon'

export type RateIconProps = {
    size?: Size
    icon?: string
    value?: number
    onHover?: any
} & CoreViewProps

export const RateIcon = (props: RateIconProps) => {
    const { size = 'md', icon = 'star', value = 0, onHover, ...rest } = props
    const containerRef = useRef(null)
    const [over, setOver] = useState(false)
    const clipPath = `inset(0 ${100 - getPercent(value)}% 0 0)`
    const className = classNames(
        {
            'f-rate-icon': true,
            'f-row': true,
            'f-buttonize': true,
        },
        [props.className]
    )

    const handleMouseEnter = (e) => {
        setOver(true)
    }

    const handleMouseLeave = (e) => {
        setOver(false)
    }

    const handleMouseMove = (e) => {
        if (!over) return
        const box = getBoundingClientRect(containerRef.current)
        const x = e.clientX - box.left
        const percent = x / box.width
        if (percent >= 0 && percent <= 1) onHover(percent)
    }

    return (
        <View
            {...rest}
            as="button"
            role="radio"
            className={className}>
            <span
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                className="f-rate-icon__top">
                <IconLib
                    icon={icon}
                    size={size}
                    style={{ clipPath }}
                />
            </span>
            <span className="f-rate-icon__bottom">
                <IconLib
                    icon={icon}
                    size={size}
                />
            </span>
        </View>
    )
}

export type RateProps = {
    onChange: (value: number) => void
    icon: any
    max?: number
    value: number
    size?: Size
    rateIconProps?: RateIconProps
} & Omit<CoreViewProps, 'onChange'>

export const Rate = (props: RateProps) => {
    const { onChange, icon, max = 5, value, size, rateIconProps, ...rest } = props
    const [innerValue, setInnerValue] = useState(value)
    const className = classNames(
        {
            'f-rate': true,
            'f-row': true,
        },
        [props.className]
    )

    const handleMouseLeave = (e) => {
        setInnerValue(value)
    }

    return (
        <View
            {...rest}
            onMouseLeave={handleMouseLeave}
            className={className}
            role="radiogroup">
            {[...Array(max)].map((_, index) => {
                return (
                    <RateIcon
                        {...rateIconProps}
                        key={index}
                        size={size}
                        icon={icon}
                        value={innerValue - index}
                        onHover={(v) => setInnerValue(index + v)}
                        onClick={() => onChange(+innerValue)}
                    />
                )
            })}
        </View>
    )
}
