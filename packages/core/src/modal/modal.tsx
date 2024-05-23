import React, { ReactElement, useEffect, useRef } from 'react'
import { Button, Icon, useFocus, ButtonProps, View, IconButton, Portal } from '../'
import { CoreViewProps } from '../types'
import { classNames, documentObject, getActionClass, getKey } from '../helpers'
import { FICircle, FIX } from '../icon'

export type ModalCloseProps = ButtonProps

export const ModalClose = (props: ModalCloseProps) => {
    return (
        <IconButton
            subtle
            {...props}
            className="f-modal__close"
            icon="x"
        />
    )
}

export type ModalAnchor =
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'middle-left'
    | 'middle-center'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'

export type ModalProps = {
    dismissOnEscape?: boolean
    focusTrap?: boolean
    anchor?: ModalAnchor
    isVisible: boolean
    footer?: ReactElement | ReactElement[]
    header?: ReactElement | ReactElement[]
    borderless?: boolean
    disableBackgroundDismiss?: boolean
    disableBackgroundEventPropagation?: boolean
    noOverlay?: boolean
    portal?: any
    onDismiss?: any
} & CoreViewProps

export const Modal = (props: ModalProps) => {
    const {
        dismissOnEscape,
        focusTrap = false,
        anchor = 'middle-center',
        isVisible = false,
        footer,
        header,
        borderless = false,
        disableBackgroundDismiss = false,
        disableBackgroundEventPropagation = false,
        noOverlay,
        portal = Portal,
        onDismiss,
        ...rest
    } = props
    const contentRef: any = useRef()
    const { trapFocus } = useFocus()

    const handleKeyDown = (e) => {
        const { isEscape } = getKey(e)
        if (isEscape && dismissOnEscape) onDismiss()
    }

    const handleBackgroundClick = (e: any) => {
        // seems necessary when nesting modals/dialogs/alerts
        if (disableBackgroundEventPropagation) {
            e.preventDefault()
            e.stopPropagation()
        }

        if (!disableBackgroundDismiss) {
            if (!contentRef.current.contains(e?.target)) {
                onDismiss()
            }
        }
    }

    useEffect(() => {
        if (focusTrap && isVisible && contentRef.current) trapFocus(contentRef.current)
        if (isVisible) {
            documentObject.documentElement.style.overflow = 'hidden'
        } else {
            documentObject.documentElement.style.removeProperty('overflow')
        }
    }, [isVisible])

    const renderModal = () => {
        const classNameOverlay = 'f-modal f-row' + (noOverlay ? ' no-overlay' : '')
        const className = classNames(
            {
                'f-modal__inner': true,
                'f-col': true,
                'is-borderless': borderless,
                'no-overlay': noOverlay,
            },
            [props.className, getActionClass(anchor)]
        )

        return (
            <div
                tabIndex={0}
                className={classNameOverlay}
                onKeyUp={handleKeyDown}
                onClick={handleBackgroundClick}>
                <View
                    {...rest}
                    className={className}
                    aria-modal={true}
                    ref={contentRef}>
                    {header && <div className="f-modal__header f-row">{header}</div>}
                    {props.children && <div className="f-modal__body">{props.children}</div>}
                    {footer && <div className="f-modal__footer f-row">{footer}</div>}
                </View>
            </div>
        )
    }

    if (isVisible) {
        if (portal) {
            return <props.portal>{renderModal()}</props.portal>
        } else {
            return renderModal()
        }
    } else {
        return null
    }
}
