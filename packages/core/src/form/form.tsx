import { CommonProps, CoreViewProps, Size } from '../types'
import React from 'react'
import { Icon, Label, Text, View, TextProps, ViewProps, IconLib } from '../'
import { classNames } from '../helpers'

export type FormFieldsetProps = {
    legend?: string
    size?: Size
} & CoreViewProps

export const FormFieldset = (props: any) => {
    const { legend, size = 'md' } = props
    const className = classNames(
        {
            'f-form-fieldset': true,
        },
        [props.className]
    )

    return (
        <View
            as="fieldset"
            className={className}>
            {legend && (
                <Text
                    as="legend"
                    size={size}>
                    {legend}
                </Text>
            )}
            {props.children}
        </View>
    )
}

export const Form = (props: ViewProps) => {
    return (
        <View
            as="form"
            {...props}
            className="f-form"
        />
    )
}

/* form field */

export type FormControlProps = {
    row?: boolean
    status?: 'error' | 'success' | 'warning'
} & CoreViewProps

export const FormControl = (props: FormControlProps) => {
    const { row, status, ...rest } = props
    const className = classNames(
        {
            'f-form-control': true,
            'f-row': row,
            'is-row': row,
            'is-error': status == 'error',
            'is-success': status == 'success',
            'is-warning': status == 'warning',
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}
        />
    )
}

/* form description */

export type FormDescriptionProps = {} & TextProps

export const FormDescription = (props: FormDescriptionProps) => {
    const className = classNames(
        {
            'f-form-description': true,
        },
        [props.className]
    )

    return (
        <Text
            {...props}
            className={className}
            size="sm"
        />
    )
}

/* form label */

export type FormLabelProps = {
    required?: boolean
    htmlFor?: string
    size?: Size
} & TextProps

export const FormLabel = (props: FormLabelProps) => {
    const { htmlFor, required, ...rest } = props
    const className = classNames(
        {
            'f-form-label': true,
            'is-required': required,
        },
        [props.className]
    )

    return (
        <Label
            {...rest}
            htmlFor={htmlFor}
            className={className}
        />
    )
}

/* helper text */

export type FormHelperTextProps = {
    size?: Size
    kind?: 'error' | 'success' | 'info' | 'warning'
    icon?: string
} & TextProps

export const FormHelperText = (props: FormHelperTextProps) => {
    const { size = 'sm', kind, icon, ...rest } = props
    const className = classNames(
        {
            'f-form-helper-text': true,
            'f-row': true,
            'is-info': kind == 'info',
            'is-error': kind == 'error',
            'is-success': kind == 'success',
            'is-warning': kind == 'warning',
        },
        [props.className]
    )

    return (
        <Text
            {...rest}
            size={size}
            className={className}>
            {icon && (
                <IconLib
                    icon={icon}
                    size="sm"
                />
            )}
            <span>{props.children}</span>
        </Text>
    )
}
