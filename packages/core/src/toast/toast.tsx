import React, { useEffect, useState } from 'react'
import { View, dispatchPubsub, usePubsub, useTimeout } from '../'
import { classNames, generateUEID, getActionClass } from '../helpers'
import { IconLib } from '../icon'
import { Text } from '../text/text'
import { CommonProps, CoreViewProps, Variant } from '../types'

const ToastProgress = (props: any) => {
    // Wait for the toast to appear
    // and React a bit quick on the draw
    const timer = 100
    const delay = props.delay - timer
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setTimeout(() => setMounted(true), timer)
    }, [])

    return (
        <div
            className="f-toast-progress"
            style={{
                transitionDuration: `${delay}ms`,
                width: mounted ? '100%' : '0%',
            }}
        />
    )
}

export const useToast = () => {
    const showToast = (payload: ToastMessage) => {
        const ueid = generateUEID()
        dispatchPubsub('toast', { ...payload, ueid })
    }

    return { showToast }
}

export type ToastAnchor = 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'top-center'

export type ToastMessage = {
    message?: string
    prefix?: any
    variant?: Variant
    showDismiss?: boolean
    showProgress?: boolean
    anchor?: ToastAnchor
    delay?: number
    toastComponent?: any
    ueid?: number | string
    containerProps?: CoreViewProps
}

export type ToastProps = {
    onDismiss?: any
} & ToastMessage

export const Toast = (props: ToastProps) => {
    const {
        message,
        prefix,
        variant = 'default',
        showDismiss = true,
        showProgress = false,
        anchor = 'right',
        delay = 3000,
        toastComponent,
        ueid,
        onDismiss,
        containerProps,
    } = props
    const className = classNames(
        {
            'f-toast': true,
            'f-row': true,
        },
        [getActionClass(variant), getActionClass(anchor)]
    )

    useTimeout(onDismiss, delay)

    return (
        <View
            {...containerProps}
            className={className}>
            {toastComponent ? toastComponent({ onDismiss }) : null}
            {!toastComponent && (
                <>
                    {prefix && <div className="f-toast__prefix f-row">{prefix}</div>}
                    <div className="f-toast__content">
                        <Text
                            size="md"
                            className="f-toast__message">
                            {message}
                        </Text>

                        {showProgress && <ToastProgress delay={delay} />}
                    </div>

                    {showDismiss && (
                        <button
                            className="f-toast__close f-buttonize f-row"
                            tabIndex={0}
                            onClick={onDismiss}>
                            <IconLib icon="x" />
                        </button>
                    )}
                </>
            )}
        </View>
    )
}

export type ToastContainerProps = {} & CommonProps

export const ToastContainer = (props: ToastContainerProps) => {
    const [messages, setMessages] = useState<any>({
        'top-left': [],
        'top-right': [],
        'top-center': [],
        'bottom-left': [],
        'bottom-right': [],
        'bottom-center': [],
    })

    const handleDelete = (message: ToastMessage) => {
        let allMessages = { ...messages }
        allMessages[message.anchor] = [...allMessages[message.anchor].filter((m) => m.ueid != message.ueid)]
        setMessages(allMessages)
    }

    const handleToastMessage = (message: ToastMessage) => {
        const m = { ...messages }
        m[message.anchor] = [...m[message.anchor], message]
        setMessages(m)
    }

    usePubsub('toast', handleToastMessage)

    return (
        <>
            {Object.keys(messages).map((key: string, index1: number) => (
                <div
                    className={`f-toast-container is-${key} f-col`}
                    key={index1}>
                    {messages[key].map((message: ToastMessage, index2: number) => (
                        <Toast
                            {...message}
                            key={message.ueid}
                            onDismiss={() => handleDelete(message)}
                        />
                    ))}
                </div>
            ))}
        </>
    )
}
