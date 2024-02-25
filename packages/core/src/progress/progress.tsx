import { classNames, getActionClass } from '../helpers'
import React, { useMemo } from 'react'
import { View } from '..'
import { CommonProps, CoreViewProps, Variant } from '../types'

export type ProgressProps = {
    indeterminate?: boolean
    animated?: boolean
    thickness?: number | string
    value: number
    variant?: Variant
} & CoreViewProps

export const Progress = (props: ProgressProps) => {
    const { animated = false, thickness = 5, value = 0, variant = 'default', indeterminate, ...rest } = props
    const { style = {} } = rest
    const className = classNames(
        {
            'f-progress': true,
            'is-animated': animated && !indeterminate,
            'is-indeterminate': indeterminate,
        },
        [props.className, getActionClass(variant)]
    )

    return (
        <View
            {...rest}
            className={className}
            aria-valuetext={`${value}%`}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
            style={{ ...style, height: thickness }}>
            <div
                style={{ width: (indeterminate ? 100 : value) + '%' }}
                className="f-progress__bar"
            />
        </View>
    )
}

export type ProgressCircleProps = {
    value: number
    thickness?: number
    size?: number
    variant?: Variant
} & CoreViewProps

export const ProgressCircle = (props: ProgressCircleProps) => {
    const { 
        value = 0, 
        thickness = '1rem', 
        size = 50, 
        variant = 'default', 
        ...rest 
    } = props
    const radius = 90
    const circ = Math.PI * (radius * 2)
    const pct = ((100 - value) / 100) * circ
    const className = classNames(
        {
            'f-circular-progress': true,
            'f-row': true,
        },
        [props.className, getActionClass(variant)]
    )

    const pieChartPath = useMemo(() => {
		const size = 160
		const radius = size / 2	
        const x = Math.cos((2 * Math.PI)/(100/value))
        const y = Math.sin((2 * Math.PI)/(100/value))
        const longArc = (value <= 50) ? 0 : 1
        return "M" + radius + "," + radius + " L" + radius + "," + 0 + ", A" + radius + "," + radius + " 0 " + longArc + ",1 " + (radius + y*radius) + "," + (radius - x*radius) + " z";		
    }, [value])
    
    return (
        <View
            {...rest}
            className={className}
            aria-valuetext={`${value}%`}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar">
            <svg
                id="svg"
                style={{ border: '1px solid red' }}
                width={size}
                height={size}
                viewBox="0 0 200 200"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <g
                    fill="grey"
                    transform="rotate(90 0 0) translate(20 -180)">
                    <path 
                        style={{ border: '1px solid blue' }}
                        d={pieChartPath}
                        fill="red"
                    /> 
                </g>

                <circle
                    r={radius}
                    cx="100"
                    cy="100"
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeDashoffset="0"
                    style={{ strokeWidth: thickness }} 
                />{/* 
                <circle
                    r={radius}
                    cx="100"
                    cy="100"
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeDashoffset={0}
                    style={{ strokeWidth: thickness, strokeDashoffset: pct }}
                    strokeLinecap="butt" 
                /> */}
            </svg>
            {!!props.children && <div className="f-circular-progress-children f-row">{props.children}</div>}
        </View>
    )
}

export type SubtleProgressProps = {
    value: number
    variant?: Variant
} & CoreViewProps

export const SubtleProgress = (props: SubtleProgressProps) => {
    const { value = 0, variant = 'default', ...rest } = props
    const className = classNames(
        {
            'f-subtle-progress': true,
        },
        [props.className, getActionClass(variant)]
    )

    return (
        <View
            {...rest}
            className={className}>
            <div
                style={{ width: value + '%' }}
                className="f-subtle-progress__bar"
                aria-valuetext={`${props.value}%`}
                aria-valuenow={props.value}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
            />
            {props.children}
        </View>
    )
}
