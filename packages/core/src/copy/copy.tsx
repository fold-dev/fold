import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { View } from '../'
import { classNames, documentObject } from '../helpers'
import { IconLib } from '../icon'
import { CoreViewProps, Size } from '../types'

export const useCopy = () => {
    const copyToClipboard = (value: any) => {
        const tempInput: any = documentObject.createElement('textarea')
        tempInput.style = 'position: absolute; left: -1000px; top: -1000px;'
        tempInput.value = value
        documentObject.body.appendChild(tempInput)
        tempInput.select()
        documentObject.execCommand('copy')
        documentObject.body.removeChild(tempInput)
    }

    return {
        copyToClipboard,
    }
}

export type CopyProps = {
    scrollOverflow?: boolean
    size?: Size
    prefix?: ReactElement | ReactNode
    suffix?: ReactElement | ReactNode
    value: string
    label?: string
} & Omit<CoreViewProps, 'label'>

export const Copy = (props: CopyProps) => {
    const { scrollOverflow, size = 'md', prefix, suffix, value, label, ...rest } = props
    const [copied, setCopied] = useState(false)
    const { copyToClipboard } = useCopy()
    const className = classNames(
        {
            'f-copy': true,
            'f-row': true,
        },
        [size, props.className]
    )
    const classNameValue = classNames({
        'f-copy__value': true,
        'f-scrollbar': true,
        'is-scrolling': scrollOverflow,
    })

    const handleCopyClick = () => {
        copyToClipboard(value)
        setCopied(true)
    }

    useEffect(() => {
        const timeout = setTimeout(() => setCopied(false), 5000)
        return () => clearTimeout(timeout)
    }, [copied])

    return (
        <View
            {...rest}
            className={className}>
            {prefix && <span className="f-copy__prefix f-row">{prefix}</span>}
            <span className={classNameValue}>
                <code>{label || value}</code>
            </span>
            <span className="f-copy__suffix f-row">
                {suffix}
                <button
                    className="f-buttonize f-copy__button"
                    onClick={handleCopyClick}>
                    <IconLib
                        size={size}
                        icon={copied ? 'check' : 'clipboard'}
                    />
                </button>
            </span>
        </View>
    )
}
