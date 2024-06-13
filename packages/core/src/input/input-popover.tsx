import React, { ReactNode, cloneElement, useRef } from 'react'
import { Popover, PopoverProps, getKey, renderChildren, useId, useVisibility } from '../'

export type InputPopoverProps = {
    __openDelay?: number
    id?: string
    firstTimeFocusOpen?: boolean
    defaultVisibility?: boolean
    addTabIndexToChild?: boolean
    popoverProps?: PopoverProps
    children: ReactNode 
    content: ReactNode
}

export const InputPopover = (props: InputPopoverProps) => {
    const { 
        __openDelay = 100,
        id, 
        addTabIndexToChild = true,
        firstTimeFocusOpen = true,
        defaultVisibility = false, 
        popoverProps = {}, 
        children, 
        content 
    } = props
    const firstTimeFocus = useRef(false)
    const isOpen = useRef(false)
    const { show, hide, visible, delayedShow } = useVisibility(defaultVisibility)
    const internalId = useId(id)

    const handleFocus = (e) => {
        if (!firstTimeFocus.current && firstTimeFocusOpen) {
            e.stopPropagation()
            e.preventDefault()
            if (!isOpen.current) delayedShow(__openDelay)
        }
    }

    const handleClick = (e) => {
        if (!isOpen.current) delayedShow(__openDelay)
    }

    const handleKeyDown = (e) => {
        const { isEnter } = getKey(e)
        if (isEnter && !isOpen.current) delayedShow(__openDelay)
    }

    const handleDismiss = (e) => {
        hide()
        isOpen.current = false
        firstTimeFocus.current = true
    }

    return (
        <Popover
            autoFocus   
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
                    tabIndex: addTabIndexToChild ? 0 : null,
                    id: internalId,
                })
            })}
        </Popover>
    )
}
