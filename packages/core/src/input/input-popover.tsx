import React, { ReactNode, cloneElement, useRef } from 'react'
import { Popover, PopoverProps, getKey, renderChildren, useId, useVisibility } from '../'

export type InputPopoverProps = {
    id?: string
    defaultVisibility?: boolean
    popoverProps?: PopoverProps
    children: ReactNode
    content: ReactNode
}

export const InputPopover = (props: InputPopoverProps) => {
    const { id, defaultVisibility = false, popoverProps = {}, children, content } = props
    const childRef = useRef(null)
    const firstTimeFocus = useRef(false)
    const isOpen = useRef(false)
    const { show, hide, visible, delayedShow } = useVisibility(defaultVisibility)
    const internalId = useId(id)

    const handleFocus = (e) => {
        if (!firstTimeFocus.current) {
            e.stopPropagation()
            e.preventDefault()
            if (!isOpen.current) delayedShow(100)
        }
    }

    const handleClick = (e) => {
        if (!isOpen.current) delayedShow(100)
    }

    const handleKeyDown = (e) => {
        const { isEnter } = getKey(e)
        if (isEnter && !isOpen.current) delayedShow(100)
    }

    const handleDismiss = (e) => {
        hide()
        isOpen.current = false
        firstTimeFocus.current = true
        childRef.current?.focus()
    }

    return (
        <Popover
            targetId={internalId}
            isVisible={visible}
            content={content}
            onDismiss={handleDismiss}
            {...popoverProps}>
            {renderChildren(children, (child) => {
                return cloneElement(child, {
                    ...child.props,
                    onFocus: handleFocus,
                    onClick: handleClick,
                    onKeyDown: handleKeyDown,
                    ref: childRef,
                    id: internalId,
                })
            })}
        </Popover>
    )
}
