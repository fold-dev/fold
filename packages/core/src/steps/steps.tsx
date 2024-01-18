import React, { ReactElement } from 'react'
import { IconLib, Stack } from '..'
import { classNames } from '../helpers'
import { CoreViewProps } from '../types'

export type StepsProps = {
    spacing?: number
} & CoreViewProps

export const Steps = (props: StepsProps) => {
    const { spacing = 10, ...rest } = props
    const className = classNames(
        {
            'f-steps': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <Stack
            {...rest}
            spacing={spacing}
            direction="horizontal"
            className={className}
            justifyContent="center">
            {props.children}
        </Stack>
    )
}

export type StepProps = {
    indicator?: ReactElement
    spacing?: number
    next?: boolean
    completed?: boolean
} & CoreViewProps

export const Step = (props: StepProps) => {
    const { indicator = <IconLib icon="check" />, spacing = 12, next, completed, ...rest } = props
    const className = classNames(
        {
            'f-step': true,
            'f-row': true,
            'is-next': next,
            'is-completed': completed,
        },
        [props.className]
    )

    return (
        <Stack
            {...rest}
            flex={1}
            spacing={spacing}
            direction="horizontal"
            className={className}
            alignItems="center">
            <div className="f-step__indicator f-row">{indicator}</div>
            {!!props.children && <div className="f-step__content f-col-row">{props.children}</div>}
            <div className="f-step__seperator" />
        </Stack>
    )
}
