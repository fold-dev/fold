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
            'f-progress-circle': true,
            'f-row': true,
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
            role="progressbar">
            <svg
                id="svg"
                width={size}
                height={size}
                viewBox="0 0 200 200"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                    r={radius}
                    cx="100"
                    cy="100"
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeDashoffset="0"
                    style={{ strokeWidth: thickness }} 
                />
                <circle
                    r={radius}
                    cx="100"
                    cy="100"
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeDashoffset={0}
                    style={{ strokeWidth: thickness, strokeDashoffset: pct }}
                    strokeLinecap="butt" 
                />
            </svg>
            {!!props.children && <div className="f-progress-circle-children f-row">{props.children}</div>}
        </View>
    )
}

export type ProgressPieProps = {
    value: number
    padding?: number
    size?: number
    variant?: Variant
} & CoreViewProps

export const ProgressPie = (props: ProgressPieProps) => {
    const { 
        value = 0, 
        padding = 5,
        size = 50, 
        variant = 'default', 
        ...rest 
    } = props
    const className = classNames(
        {
            'f-progress-pie': true,
            'f-row': true,
        },
        [props.className, getActionClass(variant)]
    )

    const pieChartPath = useMemo(() => {
        const realPadding = Math.round((padding / size) * 200)
		const viewSize = 200 - (realPadding * 2)
		const radius = viewSize / 2	
        const x = Math.cos((2 * Math.PI)/(100/value))
        const y = Math.sin((2 * Math.PI)/(100/value))
        const longArc = (value <= 50) ? 0 : 1
        const d = "M" + radius + "," + radius + " L" + radius + "," + 0 + ", A" + radius + "," + radius + " 0 " + longArc + ",1 " + (radius + y*radius) + "," + (radius - x*radius) + " z"

        return {
            d,
            p: realPadding,
        }
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
                width={size}
                height={size}
                viewBox="0 0 200 200"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                    r="100"
                    cx="100"
                    cy="100"
                    width="100%"
                    height="100%"
                    className="f-progress-pie__background"
                />
                {value < 100 && (
                    <g
                        fill="grey"
                        className="f-progress-pie__fill"
                        transform={`rotate(0 0 0) translate(${pieChartPath.p} ${pieChartPath.p})`}>
                        <path 
                            d={pieChartPath.d}
                        /> 
                    </g>
                )}
                {value >= 100 && (
                    <circle
                        r={100 - pieChartPath.p}
                        cx="100"
                        cy="100"
                        width="100%"
                        height="100%"
                        className="f-progress-pie__fill"
                    />
                )}
            </svg>
        </View>
    )
}

export type ProgressSubtleProps = {
    value: number
    variant?: Variant
} & CoreViewProps

export const ProgressSubtle = (props: ProgressSubtleProps) => {
    const { value = 0, variant = 'default', ...rest } = props
    const className = classNames(
        {
            'f-progress-subtle': true,
        },
        [props.className, getActionClass(variant)]
    )

    return (
        <View
            {...rest}
            className={className}>
            <div
                style={{ width: value + '%' }}
                className="f-progress-subtle__bar"
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
