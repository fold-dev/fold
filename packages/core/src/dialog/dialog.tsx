import { classNames } from '../helpers'
import React, { useContext } from 'react'
import { FoldContext, Heading, Modal, ModalClose, Text, useId } from '../'
import { CommonProps } from '../types'

export type DialogOptions = {
    icon?: string
    color?: string
    title?: string
    description?: string
    button?: string
    closeButton?: boolean
    onDismiss?: any
}

export const useDialog = () => {
    const { dialog, setDialog } = useContext(FoldContext)
    return { dialog, setDialog }
}

export type DialogProps = {
    isVisible: boolean
    title?: string
    description?: string
    footer?: any
    header?: any
    closeButton?: boolean
    portal?: any
    onDismiss?: any
} & CommonProps

export const Dialog = (props: DialogProps) => {
    const titleId = useId()
    const descriptionId = useId()
    const className = classNames(
        {
            'f-dialog': true,
            'f-col': true,
            'has-children': !!props.children,
        },
        [props.className]
    )

    return (
        <Modal
            focusTrap
            role="dialog"
            borderless
            width={400}
            height="fit-content"
            aria-label={props.title}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onDismiss={props.onDismiss}
            isVisible={props.isVisible}
            footer={props.footer}
            header={props.header}
            portal={props.portal}>
            {props.closeButton && <ModalClose onClick={props.onDismiss} />}
            <div className={className}>
                {props.title && !props.children && (
                    <Heading
                        as="h2"
                        id={titleId}>
                        {props.title}
                    </Heading>
                )}
                {props.description && !props.children && <Text id={descriptionId}>{props.description}</Text>}
                {props.children}
            </div>
        </Modal>
    )
}
