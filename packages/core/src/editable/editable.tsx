import React, { forwardRef, useLayoutEffect, useRef } from 'react'
import { View } from '..'
import { classNames, getKey, mergeRefs, selectElementContents, setCaretToTheEnd, stopEvent } from '../helpers'
import { CoreViewProps } from '../types'

export type EditableProps = {
    selectOnFocus?: boolean
    cursorEnd?: boolean
    disabled?: boolean
    useDoubleClick?: boolean
    onChange?: any
    onCancel?: any
} & CoreViewProps

export const Editable = forwardRef((props: EditableProps, ref) => {
    const { onChange, onCancel, disabled, selectOnFocus, cursorEnd, useDoubleClick, ...rest } = props
    const elementRef = useRef(null)
    const childRef = useRef(null)
    const cache = useRef('')
    const keypressCache = useRef(false)
    const className = classNames(
        {
            'f-editable': true,
        },
        [props.className]
    )

    const handleChange = (value: string) => {
        if (onChange) onChange(value)
    }

    // disable drag
    // TODO: find a better way to handle this
    const noEvent = (e) => e.stopPropagation()

    const deFocus = (target: HTMLElement, type: 'escape' | 'enter' | 'focusout') => {
        target.contentEditable = 'false'
        target.removeAttribute('tabindex')
        target.removeEventListener('keydown', handleKeyDown)
        target.removeEventListener('focusout', handleFocusOut)
        target.removeEventListener('mousedown', noEvent)
        target.blur()
        keypressCache.current = false
        switch (type) {
            case 'escape':
                return onCancel ? onCancel(cache.current) : null
            case 'enter':
                return handleChange(target.textContent)
            case 'focusout':
                return handleChange(target.textContent)
        }
    }

    const handleFocusOut = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        if (keypressCache.current) return
        const target: any = e.target
        deFocus(target, 'focusout')
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        const { metaKey, key } = e
        const { isEnter, isEscape } = getKey(e)

        if (isEscape) {
            e.preventDefault()
            e.stopPropagation()
            keypressCache.current = true
            deFocus(e.currentTarget as HTMLElement, 'escape')
        }

        if (isEnter) {
            e.preventDefault()
            e.stopPropagation()
            keypressCache.current = true
            deFocus(e.currentTarget as HTMLElement, 'enter')
            return
        }

        if (metaKey) {
            switch (key) {
                case 'b':
                    return e.preventDefault()
                case 's':
                    return e.preventDefault()
                case 'i':
                    return e.preventDefault()
            }
        }
    }

    const handleClick = (e) => {
        if (disabled) return
        const el: HTMLElement = childRef.current
        el.tabIndex = 1
        el.contentEditable = 'true'
        el.spellcheck = false
        el.addEventListener('keydown', handleKeyDown)
        el.addEventListener('focusout', handleFocusOut)
        el.addEventListener('mousedown', noEvent)
        cache.current = el.textContent
        setTimeout(() => {
            el.focus()
            if (cursorEnd) setCaretToTheEnd(el)
            if (selectOnFocus) selectElementContents(el)
        })
    }

    useLayoutEffect(() => {
        childRef.current = elementRef.current.childNodes[0]
    }, [])

    return (
        <View
            {...rest}
            className={className}
            onClick={useDoubleClick ? undefined : handleClick}
            onDoubleClick={useDoubleClick ? handleClick : undefined}
            ref={mergeRefs([elementRef, ref])}>
            {props.children}
        </View>
    )
})
