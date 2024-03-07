import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, CoreInputProps } from '..'
import { CommonProps, CoreViewProps, Size } from '../types'
import { classNames, mergeRefs } from '../helpers'

export type TextareaProps = {
    size?: Size
    value: string
    selectOnFocus?: boolean
    minHeight?: number | string
    maxHeight?: number | string
    autoAdjust?: boolean
} & CoreViewProps &
    CoreInputProps

export const Textarea = forwardRef((props: TextareaProps, ref) => {
    const { size = 'md', selectOnFocus, value, minHeight = 100, maxHeight, autoAdjust, style = {}, ...rest } = props
    const textareaRef = useRef<any>(null)
    const className = classNames(
        {
            'f-textarea': true,
        },
        [size, props.className]
    )

    const adjustHeight = () => {
        if (!autoAdjust) return
        if (textareaRef.current) {
            if (textareaRef.current.style) {
                textareaRef.current.style.height = '0px'
                const scrollHeight = textareaRef.current.scrollHeight
                textareaRef.current.style.height = scrollHeight + 'px'
            }
        }
    }

    const onFocus = () => selectOnFocus ? textareaRef.current?.select() : null

    useEffect(() => {
        if (!textareaRef.current) return
        textareaRef.current?.addEventListener('focus', onFocus)
        return () => textareaRef.current?.removeEventListener('focus', onFocus)
    })

    useLayoutEffect(() => adjustHeight(), [value])

    return (
        <View
            {...rest}
            as="textarea"
            className={className}
            ref={mergeRefs([textareaRef, ref])}
            value={value}
            style={{ ...style, minHeight, maxHeight }}
            aria-multiline="true"
        />
    )
})
