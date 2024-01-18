import React, { useState } from 'react'
import { CoreInputProps, View, ViewProps } from '..'
import { classNames, getKey } from '../helpers'
import { CoreViewProps, Size } from '../types'

export const useRadio = (defaultValue: any) => {
    const [option, setOption] = useState(defaultValue)
    return {
        option,
        setOption: (value) => {
            setOption(option == value ? null : value)
        },
    }
}

export type RadioGroupProps = {} & ViewProps

export const RadioGroup = (props: RadioGroupProps) => {
    return (
        <View
            {...props}
            role="radiogroup"
        />
    )
}

export type RadioProps = {
    size?: Size
} & CoreViewProps &
    CoreInputProps

export const Radio = (props: RadioProps) => {
    const { size = 'md', ...rest } = props
    const className = classNames(
        {
            'f-radio': true,
        },
        [size, props.className]
    )

    const handleClick = (e) => {
        if (props.disabled) return
        if (props.onChange) props.onChange(e)
    }

    const handleChange = (e) => {
        if (props.disabled) return
        if (props.onChange) props.onChange(e)
    }

    const handleKeyDown = (e) => {
        const { isSpace, isEnter } = getKey(e)
        if (isSpace || isEnter) {
            e.preventDefault()
            e.stopPropagation()
            if (props.onChange) props.onChange(e)
        }
    }

    return (
        <View
            {...rest}
            as="input"
            type="radio"
            aria-checked={props.checked}
            className={className}
            onClick={handleClick}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    )
}
