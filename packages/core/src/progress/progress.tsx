import { classNames, getActionClass } from '../helpers'
import React from 'react'
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

export type CircularProgressProps = {
    value: number
    thickness?: number
    size?: number
    variant?: Variant
} & CoreViewProps

export const CircularProgress = (props: CircularProgressProps) => {
    const { value = 0, thickness = '1rem', size = 50, variant = 'default', ...rest } = props
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
                    style={{ strokeWidth: thickness }}></circle>
                <circle
                    r={radius}
                    cx="100"
                    cy="100"
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeDashoffset={0}
                    style={{ strokeWidth: thickness, strokeDashoffset: pct }}
                    strokeLinecap="butt"></circle>
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
