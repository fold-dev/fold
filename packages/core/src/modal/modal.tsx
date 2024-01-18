import React, { ReactElement, useEffect, useRef } from 'react'
import { Button, Icon, useFocus, ButtonProps, View, IconButton } from '../'
import { CoreViewProps } from '../types'
import { classNames, getActionClass } from '../helpers'
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
    focusTrap?: boolean
    anchor?: ModalAnchor
    isVisible: boolean
    footer?: ReactElement | ReactElement[]
    header?: ReactElement | ReactElement[]
    borderless?: boolean
    disableBackgroundDismiss?: boolean
    portal?: any
    onDismiss?: any
} & CoreViewProps

export const Modal = (props: ModalProps) => {
    const {
        focusTrap = false,
        anchor = 'middle-center',
        isVisible = false,
        footer,
        header,
        borderless = false,
        disableBackgroundDismiss = false,
        portal,
        onDismiss,
        ...rest
    } = props
    const contentRef: any = useRef()
    const { trapFocus } = useFocus()

    const handleBackgroundClick = (e: any) => {
        // seems necessary when nesting modals/dialogs/alerts
        e.preventDefault()
        e.stopPropagation()

        if (!disableBackgroundDismiss) {
            if (!contentRef.current.contains(e?.target)) {
                onDismiss()
            }
        }
    }

    useEffect(() => {
        if (focusTrap && isVisible && contentRef.current) trapFocus(contentRef.current)
    }, [isVisible])

    const renderModal = () => {
        const className = classNames(
            {
                'f-modal__inner': true,
                'f-col': true,
                'is-borderless': borderless,
            },
            [props.className, getActionClass(anchor)]
        )

        return (
            <div
                className="f-modal f-row"
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
