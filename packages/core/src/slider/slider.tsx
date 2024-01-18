import { useDragging } from '../hooks/dragging.hook'
import { useEvent } from '../hooks/event.hook'
import { clamp, classNames, getBoundingClientRect, getKey, globalCursor } from '../helpers'
import React, { ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Icon, IconLib, View } from '..'
import { Text } from '../text/text'
import { TooltipContent } from '../tooltip/tooltip'
import { CoreViewProps, PopoutPosition } from '../types'

export const useSlider = (defaultValues: [number, number?]) => {
    const [value, setValue] = useState<any>(defaultValues)
    return { value, setValue: (value) => setValue([...value]) }
}

export type SliderHandleProps = {
    thumbIcon?: string
    showTooltipAlways?: boolean
    showTooltip?: boolean
    tooltipPosition?: PopoutPosition
    tooltipValue?: any
    disabled?: boolean
    min: number
    max: number
    step: number
    railRef: any
    value: any
    onChange: any
}

export const SliderHandle = (props: SliderHandleProps) => {
    const { step, min, max, showTooltipAlways, showTooltip, tooltipPosition, disabled } = props
    const { dragging, startDragging, stopDragging } = useDragging()
    const [handle, setHandle] = useState(0)
    const handleRef = useRef(null)
    const showTooltipFinal = showTooltipAlways || (dragging && showTooltip)
    const className = classNames({
        'f-slider__handle': true,
        'f-row': true,
        'is-dragging': dragging,
    })

    const moveForward = () => props.onChange(clamp(props.value + step, min, max))

    const moveBackward = () => props.onChange(clamp(props.value - step, min, max))

    const handleMouseMove = (e) => {
        if (!dragging) return

        const { width, x } = getBoundingClientRect(props.railRef.current)
        const left = e.clientX - x
        const percent = (left / width) * 100
        const difference = Math.abs(min - max)
        const percentageMultiplier = percent / 100
        const value = difference * percentageMultiplier + min
        const roundedValue = Math.round(value / step) * step

        props.onChange(clamp(roundedValue, min, max))
    }

    const handleMouseUp = (e) => {
        stopDragging()
        globalCursor.remove('grabbing')
    }

    const handleMouseDown = (e) => {
        startDragging()
        globalCursor.add('grabbing')
    }

    const handleKeyDown = (e) => {
        const { isUp, isDown, isLeft, isRight } = getKey(e)
        let flag = false

        if (isUp || isRight) {
            moveForward()
            flag = true
        }

        if (isDown || isLeft) {
            moveBackward()
            flag = true
        }

        if (flag) {
            e.stopPropagation()
            e.preventDefault()
        }
    }

    useEvent('mousemove', handleMouseMove)
    useEvent('mouseup', handleMouseUp)

    useLayoutEffect(() => {
        const { min, max } = props
        const increment = Math.abs(min - props.value)
        const total = Math.abs(min - max)
        const percent = (increment / total) * 100

        setHandle(percent)
    }, [props.value])

    return (
        <button
            role="button"
            tabIndex={0}
            disabled={disabled}
            ref={handleRef}
            className={className}
            onKeyDown={handleKeyDown}
            style={{
                left: handle + '%',
                zIndex: dragging ? 2 : 1,
            }}>
            {props.thumbIcon && <IconLib icon={props.thumbIcon} />}

            <div
                className="f-slider__handle-dragger"
                onMouseDown={handleMouseDown}
            />

            {showTooltipFinal && (
                <div className="f-slider__tooltip">
                    <TooltipContent anchor={tooltipPosition}>
                        {props.tooltipValue ? props.tooltipValue(props.value) : props.tooltipValue}
                    </TooltipContent>
                </div>
            )}
        </button>
    )
}

export type SliderProps = {
    thumbIcons?: string[]
    showTooltipAlways?: boolean
    showTooltip?: boolean
    tooltipPosition?: PopoutPosition
    tooltipValue?: any
    labelValue?: any
    onChange: any
    markers?: number
    values: number[]
    min: number
    max: number
    disabled?: boolean
    step?: number
    anchor: number
    labels?: boolean
} & CoreViewProps

export const Slider = (props: SliderProps) => {
    const {
        thumbIcons,
        showTooltipAlways = false,
        showTooltip = false,
        tooltipPosition = 'top-center',
        tooltipValue,
        labelValue,
        onChange,
        markers = 0,
        values,
        min,
        max,
        disabled,
        step = 0.1,
        anchor,
        labels,
        ...rest
    } = props
    const markerArray = useMemo(() => new Array(markers).fill(null), [markers])
    const railRef = useRef(null)
    const sliderRef = useRef(null)
    const [left, setLeft] = useState(0)
    const [width, setWidth] = useState(50)
    const [unbalanced, setUnbalanced] = useState(false)
    const className = classNames(
        {
            'f-slider': true,
        },
        [props.className]
    )

    const calculateUnbalance = (values) => {
        if (values.length == 2) {
            if (values[0] > values[1] || values[1] < values[0]) {
                setUnbalanced(true)
            } else {
                setUnbalanced(false)
            }
        }
    }

    const handleChange = (index: number, value: number) => {
        const newValues = values
        newValues[index] = value
        onChange([...values])
    }

    useLayoutEffect(() => {
        const maxValue = Math.max(...values)
        const minValue = Math.min(...values)
        const maxIncrement = Math.abs(min - maxValue)
        const minIncrement = Math.abs(min - minValue)
        const maxTotal = Math.abs(min - max)
        const minTotal = Math.abs(min - max)
        const maxPercent = (maxIncrement / maxTotal) * 100
        const minPercent = (minIncrement / minTotal) * 100
        const width = maxPercent - minPercent

        if (values.length == 1) {
            const anchorIncrement = Math.abs(min - anchor)
            const anchorTotal = Math.abs(min - max)
            const anchorPercent = (anchorIncrement / anchorTotal) * 100

            if (maxPercent > anchorPercent) {
                setLeft(anchorPercent)
                setWidth(maxPercent - anchorPercent)
            } else {
                setLeft(minPercent)
                setWidth(anchorPercent - minPercent)
            }
        } else {
            setLeft(minPercent)
            setWidth(width)
        }
    }, [values])

    useLayoutEffect(() => {
        calculateUnbalance(values)
    }, [values])

    return (
        <View
            {...rest}
            ref={sliderRef}
            tabIndex={-1}
            role="slider"
            className={className}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-orientation="horizontal">
            <div className="f-slider__slider">
                {values.map((value1, index) => {
                    return (
                        <SliderHandle
                            key={index}
                            step={step}
                            thumbIcon={thumbIcons ? thumbIcons[index] : undefined}
                            showTooltip={showTooltip}
                            showTooltipAlways={showTooltipAlways}
                            tooltipPosition={tooltipPosition}
                            tooltipValue={tooltipValue}
                            min={min}
                            max={max}
                            disabled={disabled}
                            railRef={railRef}
                            value={value1}
                            onChange={(value2) => handleChange(index, value2)}
                        />
                    )
                })}

                <div
                    className="f-slider__rail"
                    ref={railRef}>
                    {!!markers && (
                        <div className="f-slider__markers f-row">
                            {markerArray.map((_, index) => {
                                return (
                                    <span
                                        className="f-slider__marker"
                                        key={index}></span>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div
                    className={classNames({
                        'f-slider__fill': true,
                        'is-unbalanced': unbalanced,
                    })}
                    style={{
                        left: left + '%',
                        width: width + '%',
                    }}
                />
            </div>

            {labels && labelValue && !!markers && (
                <div className="f-slider__footer f-row">
                    {markerArray.map((_, index) => {
                        return (
                            <div
                                className="f-slider__footer-marker"
                                key={index}>
                                <Text
                                    size="sm"
                                    as="span">
                                    {labelValue(index)}
                                </Text>
                            </div>
                        )
                    })}
                </div>
            )}
        </View>
    )
}
