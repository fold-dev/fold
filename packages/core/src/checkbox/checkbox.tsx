import React, { useMemo } from 'react'
import { CoreInputProps, IconLib, IconProps, View } from '..'
import { addAlpha, classNames, getKey } from '../helpers'
import { CoreViewProps, Size } from '../types'

export type CheckboxProps = {
    indeterminate?: boolean
    size?: Size
    checked: boolean
} & CoreViewProps &
    CoreInputProps

export const Checkbox = (props: CheckboxProps) => {
    const { size = 'md', indeterminate, checked, ...rest } = props
    const className = classNames(
        {
            'f-checkbox': true,
            'is-indeterminate': indeterminate,
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
        if (props.disabled) return
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
            type="checkbox"
            checked={checked}
            aria-checked={checked}
            className={className}
            onClick={handleClick}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    )
}

export type CheckboxAltProps = {
    size?: Size
    iconProps?: IconProps
    icon?: string
    color?: string
    checked: boolean
    onChange: any
} & CoreViewProps

export const CheckboxAlt = (props: CheckboxAltProps) => {
    const { size = 'md', iconProps = {}, icon = 'check', color, checked, style = {}, onChange, ...rest } = props
    const styles = useMemo(
        () =>
            checked && color
                ? {
                      ...style,
                      color,
                      backgroundColor: addAlpha(color, 0.15),
                      borderColor: color,
                  }
                : style,
        [color, style]
    )
    const className = classNames(
        {
            'f-checkbox-alt': true,
            'f-row': true,
            'is-active': checked,
        },
        [props.className, size]
    )

    return (
        <View
            {...rest}
            as="button"
            role="checkbox"
            aria-checked={props.checked}
            className={className}
            style={styles}
            onClick={onChange}>
            {checked && (
                <IconLib
                    icon={icon}
                    {...iconProps}
                />
            )}
        </View>
    )
}
