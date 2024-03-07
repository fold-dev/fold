import React, { forwardRef, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { View } from '..'
import { classNames, getLetterArray, mergeRefs, renderWithProps, windowObject } from '../helpers'
import { IconLib } from '../icon/icon'
import { CoreViewProps, Size } from '../types'

/* input number control */

export type InputNumberControlProps = {
    size?: Size
    disableIncrease?: boolean
    disableDecrease?: boolean
    onIncrease?: any
    onDecrease?: any
} & CoreViewProps

export const InputNumberControl = (props: InputNumberControlProps) => {
    const { size = 'md', disableIncrease, disableDecrease, onIncrease, onDecrease, ...rest } = props
    const className = classNames(
        {
            'f-input-number-control': true,
            'f-col': true,
        },
        [size, props.className]
    )

    return (
        <View
            {...rest}
            className={className}>
            <button
                onClick={onIncrease}
                disabled={disableIncrease}
                className="f-row f-buttonize">
                <IconLib
                    size={size}
                    icon="chevron-up"
                />
            </button>
            <button
                onClick={onDecrease}
                disabled={disableDecrease}
                className="f-row f-buttonize">
                <IconLib
                    size={size}
                    icon="chevron-down"
                />
            </button>
        </View>
    )
}

export type InputControlProps = CoreViewProps

export const InputControl = forwardRef((props: InputControlProps, ref) => {
    const className = classNames(
        {
            'f-input-control': true,
            'f-row': true,
            'is-disabled': props.disabled,
        },
        [props.className]
    )

    return (
        <View
            {...props}
            className={className}
            ref={ref}
            tabIndex={0}
        />
    )
})

/* input field */

export type CoreInputProps = {
    type?:
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'hidden'
        | 'month'
        | 'number'
        | 'password'
        | 'search'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week'
} & CoreViewProps &
    Omit<InputHTMLAttributes<any>, 'size' | 'type'>

export type InputProps = {
    size?: Size
    showIndicator?: boolean
    selectOnFocus?: boolean
} & CoreViewProps &
    CoreInputProps

export const Input = forwardRef((props: InputProps, ref) => {
    const { showIndicator, selectOnFocus, size = 'md', ...rest } = props
    const inputRef = useRef(null)
    const className = classNames(
        {
            'f-input': true,
            'f-input-common': true,
            'show-indicator': showIndicator,
        },
        [size, props.className]
    )

    const onFocus = () => selectOnFocus ? inputRef.current?.select() : null

    useEffect(() => {
        if (!inputRef.current) return
        inputRef.current?.addEventListener('focus', onFocus)
        return () => inputRef.current?.removeEventListener('focus', onFocus)
    })

    return (
        <View
            {...rest}
            as="input"
            className={className}
            ref={mergeRefs([inputRef, ref])}
        />
    )
})

/* prefix */

export type InputPrefixProps = CoreViewProps

export const InputPrefix = (props: InputPrefixProps) => {
    const ref = useRef(null)
    const className = classNames(
        {
            'f-input-prefix': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <View
            {...props}
            className={className}
            ref={ref}
        />
    )
}

/* suffix */

export type InputSuffixProps = CoreViewProps

export const InputSuffix = (props: InputSuffixProps) => {
    const ref = useRef(null)
    const className = classNames(
        {
            'f-input-suffix': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <View
            {...props}
            className={className}
            ref={ref}
        />
    )
}

/* pin */

export type PinInputProps = {
    disabled?: boolean
    size?: Size
    digits?: number
    type?: 'text' | 'password'
    defaultValue: string
    onChange: any
} & CoreViewProps

export const PinInput = (props: PinInputProps) => {
    const { disabled, size, digits = 4, type = 'password', defaultValue, onChange, ...rest } = props
    const [values, setValues] = useState(getLetterArray(defaultValue, digits))
    const containerRef = useRef<any>({})
    const className = classNames(
        {
            'f-pin-input': true,
            'f-row': true,
        },
        [props.className]
    )

    const handleHighlightInput = (index: number) => {
        const el: any = containerRef.current.querySelectorAll('input')[index]
        if (el) el.select()
    }

    const handleChangeAtIndex = (value1: any, index1: number) => {
        const newValues = values.map((value2, index2) => (index1 == index2 ? value1 : value2))
        setValues(newValues)
        onChange(newValues)
        const nextIndex = index1 + 1
        if (nextIndex <= digits) handleHighlightInput(nextIndex)
    }

    const getValueAtIndex = (index: number) => {
        if (values[index]) {
            return values[index]
        } else {
            return ''
        }
    }

    const handlePaste = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const clipboardData = e.clipboardData || windowObject.clipboardData
        const pastedData = clipboardData.getData('Text')
        if (!pastedData) return
        setValues(pastedData.split('').filter((_, index) => index < values.length))
        handleHighlightInput(values.length - 1)
    }

    return (
        <View
            {...rest}
            className={className}
            onPaste={handlePaste}
            ref={containerRef}>
            {new Array(digits).fill(null).map((_, index) => {
                return (
                    <Input
                        key={index}
                        size={size}
                        type={type}
                        disabled={disabled}
                        maxLength={1}
                        value={getValueAtIndex(index)}
                        onChange={(e) => handleChangeAtIndex(e.target.value, index)}
                        onFocus={() => handleHighlightInput(index)}
                    />
                )
            })}
        </View>
    )
}

/* multi */

export type ComboInputFieldProps = CoreViewProps & CoreInputProps

export const ComboInputField = (props: ComboInputFieldProps) => {
    return (
        <View
            {...props}
            as="input"
            role="textbox"
            type="search"
        />
    )
}

export type ComboInputProps = {
    render: any
    size?: Size
    disabled?: boolean
} & CoreViewProps

export const ComboInput = forwardRef((props: ComboInputProps, ref) => {
    const { render, size = 'md', disabled, ...rest } = props
    const className = classNames(
        {
            'f-combo-input': true,
            'f-input-common': true,
            'f-align-h-middle-left': true,
            'is-disabled': disabled,
        },
        [props.className, size]
    )

    const handleFocus = (e) => {
        const el = e.currentTarget.querySelector(':scope > input')
        el?.focus()
        if (props.onFocus) props.onFocus(e)
    }

    return (
        <View
            {...rest}
            ref={ref}
            className={className}
            tabIndex={disabled ? -1 : 0}
            onFocus={handleFocus}>
            {render()}
            {renderWithProps(props.children, {
                disabled,
                size,
            })}
        </View>
    )
})
