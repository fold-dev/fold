import React, { ReactElement } from 'react'
import { Variant } from '../'
import { Button, ButtonGroup } from '../button/button'
import { Heading } from '../heading/heading'
import { classNames } from '../helpers'
import { Modal, ModalProps } from '../modal/modal'
import { Stack } from '../stack/stack'

export const useCookie = () => {
    // Need implementation
    return {}
}

export type CookieButton = {
    label: string
    action: any
    variant?: Variant
}

export type CookieProps = {
    title?: string
    description?: ReactElement
    buttons?: CookieButton[]
    onOkay?: any
    onCancel?: any
} & ModalProps

export const Cookie = (props: CookieProps) => {
    const {
        title,
        description,
        anchor = 'bottom-right',
        width = 500,
        height = 'fit-content',
        onOkay,
        onCancel,
        buttons = [
            { label: 'Deny', action: () => onOkay(), variant: 'accent' },
            { label: 'Accept', action: () => onCancel(), variant: 'accent' },
        ],
        ...rest
    } = props
    const className = classNames(
        {
            'f-cookie': true,
        },
        [props.className]
    )

    return (
        <Modal
            {...rest}
            width={width}
            height={height}
            anchor={anchor}
            className={className}>
            <Stack
                spacing={20}
                direction="vertical"
                width="100%">
                {title && <Heading>{title}</Heading>}
                {description}
                <ButtonGroup width="100%">
                    {buttons.map((button: CookieButton, index: number) => (
                        <Button
                            key={index}
                            variant={button.variant}
                            onClick={button.action}>
                            {button.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </Stack>
        </Modal>
    )
}
