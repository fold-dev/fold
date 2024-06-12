import React, { forwardRef, ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
    Input,
    InputControl,
    InputPrefix,
    InputProps,
    InputSuffix,
    TagInput,
    TagInputField,
    TagInputFieldProps,
    TagInputProps,
    Text,
    useEvent,
    useId,
    useTimer,
    useVisibility,
    View,
    Virtual,
} from '../'
import {
    classNames,
    executeLast,
    getBoundingClientRect,
    getKey,
    isBoxOffScreen,
    mergeRefs,
    scrollToCenter,
} from '../helpers'
import { IconLib } from '../icon'
import { CoreViewProps, Size } from '../types'

export type SelectProps = {
    noListFocus?: boolean
    hideSelected?: boolean
    as?: 'default' | 'virtual'
    variant?: 'default' | 'static'
    size?: Size
    customPlaceholder?: string
    placeholder: string
    disabled?: boolean
    readOnly?: boolean
    fixed?: boolean
    selected: (string | number)[]
    options: SelectOption[]
    footer?: ReactElement | null
    header?: ReactElement | null
    onSelect: any
    onFilter?: any
    onOpen?: () => void
    onClose?: () => void
    filterDelay?: number
    inputProps?: InputProps
    prefix?: any
    suffix?: any
    tagInputProps?: TagInputProps
    tagInputFieldProps?: TagInputFieldProps
    selectListProps?: SelectListProps
    virtualProps?: SelectListVirtual
    optionComponent?: any
    noOptionsComponent?: any
    render?: any
    tagInput?: boolean
} & Omit<CoreViewProps, 'onSelect'>

export const Select = (props: SelectProps) => {
    const {
        noListFocus,
        hideSelected = false,
        as = 'default',
        variant = 'default',
        size,
        customPlaceholder,
        placeholder,
        disabled,
        readOnly,
        selected = [],
        options = [],
        footer,
        header,
        onSelect,
        onFilter,
        onOpen,
        onClose,
        filterDelay = 1000,
        inputProps,
        prefix,
        suffix,
        tagInputProps = {},
        tagInputFieldProps = {},
        selectListProps = {},
        virtualProps = { maxHeight: 300, itemHeight: 35 },
        optionComponent,
        noOptionsComponent,
        render,
        tagInput,
        ...rest
    } = props
    const selectedAmount = selected.length
    const isStatic = variant == 'static'
    const { show, hide, visible } = useVisibility(isStatic)
    const { setTimer, clearTimer } = useTimer()
    const popupId = useId()
    const popoverRef = useRef(null)
    const listRef = useRef(null)
    const popupContentId = useId()
    const containerRef = useRef(null)
    const [offscreen, setOffscreen] = useState(false)
    const [cursor, setCursor] = useState(-1)
    const [text, setText] = useState('')
    const filteredOptions = useMemo(() => {
        return options.filter((option: SelectOption) => {
            if (option.sticky) {
                return true
            } else {
                const isPartOfSearchText = option.label.toLowerCase().includes(text.toLowerCase())
                const isSelected = selected.includes(option.key)
                return hideSelected ? !isSelected && isPartOfSearchText : isPartOfSearchText
            }
        })
    }, [options, selected, text])
    const finalPlaceholder = useMemo(() => {
        if (customPlaceholder) return customPlaceholder
        if (selectedAmount == 0) return placeholder
        const option = options.find((option) => option.key == selected[0])
        const label = option ? option.label : ''
        if (selectedAmount > 1) {
            return `${label} & ${selectedAmount - 1} more`
        } else {
            return label
        }
    }, [options, selected, placeholder])
    const containerClassName = classNames({
        'f-select-container': true,
        'is-static': isStatic,
    })
    const className = classNames(
        {
            'f-select': true,
            'is-placeholder': selectedAmount == 0,
        },
        [props.className]
    )
    const popoverClassName = classNames({
        'f-select-popover': true,
        'is-offscreen': offscreen,
    })

    const handleChange = (e) => {
        setText(e.target.value)
        if (!visible) show()
    }

    const handleFocus = (e) => {
        if (!visible) show()
    }

    const clear = () => {
        setText('')
    }

    const dismiss = () => {
        if (!isStatic) hide()
        clear()
    }

    const handleOptionClick = (option: SelectOption) => {
        if (option.disabled) return
        onSelect(option, dismiss, clear)
    }

    const handleClickOutside = (e) => {
        if (containerRef.current) {
            if (!containerRef.current?.contains(e.target)) {
                dismiss()
            }
        }
    }

    const handleKeyDown = (e) => {
        const { isUp, isDown, isEnter, isEscape } = getKey(e)

        if (isEscape && visible) {
            e.preventDefault()
            e.stopPropagation()
            hide()
        }

        if (isUp || isDown || isEnter) {
            e.preventDefault()
            e.stopPropagation()

            if (isUp) setCursor(cursor == 0 ? filteredOptions.length - 1 : cursor - 1)
            if (isDown) setCursor(cursor == filteredOptions.length - 1 ? 0 : cursor + 1)
            if (isEnter) handleOptionClick(filteredOptions[cursor])
            if ((isUp || isDown) && as == 'default') scrollCursorIntoView()
        }
    }

    const scrollCursorIntoView = () => {
        executeLast(() => {
            scrollToCenter(listRef.current.querySelector(`.is-focused`))
        })
    }

    const renderInput = () => {
        if (tagInput) {
            return (
                <TagInput
                    size={size}
                    id={popupId}
                    disabled={disabled}
                    onFocus={handleFocus}
                    className="f-select"
                    render={render}
                    {...tagInputProps}>
                    <TagInputField
                        value={text}
                        onChange={handleChange}
                        placeholder={placeholder}
                        {...tagInputFieldProps}
                    />
                </TagInput>
            )
        } else {
            return (
                <InputControl
                    onClick={handleFocus}
                    disabled={disabled}>
                    {prefix && <InputPrefix>{prefix}</InputPrefix>}
                    <Input
                        size={size}
                        id={popupId}
                        type="search"
                        autoComplete="off"
                        value={text}
                        placeholder={finalPlaceholder}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        className={className}
                        disabled={disabled}
                        readOnly={readOnly}
                        {...inputProps}
                    />
                    {suffix && <InputSuffix>{suffix}</InputSuffix>}
                </InputControl>
            )
        }
    }

    useEvent('click', handleClickOutside, true)

    useEffect(() => {
        setTimer(() => {
            if (onFilter && !!text) onFilter(text)
        }, filterDelay)
    }, [text])

    useEffect(() => {
        if (visible) {
            if (onOpen) onOpen()
        } else {
            if (onClose) onClose()
        }
    }, [visible])

    useEffect(() => {
        setCursor(0)
    }, [text, visible])

    useEffect(() => {
        if (as != 'virtual') return
        const virtual = listRef.current?.querySelector(`.f-virtual`)
        virtual?.scrollTo(0, virtualProps.itemHeight * cursor)
    }, [cursor])

    useLayoutEffect(() => {
        if (!visible) return
        if (variant == 'static') return
        const { bottom, left } = getBoundingClientRect(containerRef.current)
        const { width, height } = getBoundingClientRect(popoverRef.current)
        setOffscreen(isBoxOffScreen({ top: bottom, left, width, height }).y)
    }, [visible, variant])

    return (
        <View
            {...rest}
            ref={containerRef}
            className={containerClassName}
            onKeyDown={handleKeyDown}>
            {renderInput()}
            {visible && (
                <div
                    ref={popoverRef}
                    className={popoverClassName}>
                    <SelectList
                        noFocus={noListFocus}
                        as={as}
                        ref={listRef}
                        cursor={cursor}
                        options={filteredOptions}
                        selected={selected}
                        id={popupContentId}
                        header={header}
                        footer={footer}
                        optionComponent={optionComponent}
                        noOptionsComponent={noOptionsComponent}
                        virtualProps={virtualProps}
                        onOptionClick={handleOptionClick}
                        onCursorUpdate={(index) => setCursor(index)}
                        {...selectListProps}
                    />
                </div>
            )}
        </View>
    )
}

export type SelectListProps = {
    noFocus?: boolean
    as?: 'default' | 'virtual'
    cursor?: number
    options?: SelectOption[]
    selected?: (string | number)[]
    onOptionClick?: any
    onCursorUpdate?: any
    header?: ReactElement | null
    footer?: ReactElement | null
    optionComponent?: any
    noOptionsComponent?: any
    virtualProps?: SelectListVirtual
} & CoreViewProps

export const SelectList = forwardRef((props: SelectListProps, ref) => {
    const {
        noFocus,
        as = 'default',
        cursor = 0,
        options = [],
        selected,
        onOptionClick,
        onCursorUpdate,
        header,
        footer,
        optionComponent,
        noOptionsComponent = <Text p="var(--f-select-option-padding)">No options available</Text>,
        virtualProps = { maxHeight: 300, itemHeight: 35 },
        ...rest
    } = props
    const { maxHeight, itemHeight } = virtualProps
    const containerRef = useRef(null)
    const listRef = useRef(null)
    const Component = optionComponent || SelectListOption
    const isVirtual = as == 'virtual'
    const isDefault = as == 'default'
    const noOptions = options.length == 0
    const className = classNames({
        'f-select-list': true,
        'is-virtual': isVirtual,
    })

    useEffect(() => {
        if (!noFocus) containerRef.current?.focus()
    }, [noFocus])

    return (
        <View
            {...rest}
            tabIndex={0}
            className={className}
            ref={containerRef}>
            {header}

            <ul
                className="f-scrollbar"
                ref={mergeRefs([ref, listRef])}>
                {noOptions && (
                    <li
                        tabIndex={-1}
                        role="listitem"
                        className="f-select-list-option-container">
                        {noOptionsComponent}
                    </li>
                )}

                {isDefault && (
                    <>
                        {options.map((option: SelectOption, index: number) => {
                            const className = classNames({
                                'f-select-list-option-container': true,
                                'is-focused': cursor == index,
                            })

                            return (
                                <li
                                    key={index}
                                    tabIndex={!option.disabled ? 0 : -1}
                                    role="listitem"
                                    className={className}>
                                    <Component
                                        option={option}
                                        selected={selected.includes(option.key)}
                                        onOptionClick={() => {
                                            onOptionClick(option)
                                            if (onCursorUpdate) onCursorUpdate(index)
                                        }}
                                    />
                                </li>
                            )
                        })}
                    </>
                )}

                {isVirtual && (
                    <Virtual
                        watch={[...selected, cursor]}
                        maxHeight={maxHeight}
                        itemHeight={itemHeight}
                        numItems={options.length}
                        render={({ index, style }) => {
                            const option: SelectOption = options[index]
                            const className = classNames({
                                'f-select-list-option-container': true,
                                'is-focused': cursor == index,
                            })

                            return (
                                <li
                                    key={index}
                                    tabIndex={!option.disabled ? 0 : -1}
                                    role="listitem"
                                    style={style}
                                    className={className}>
                                    <Component
                                        option={option}
                                        selected={selected.includes(option.key)}
                                        onOptionClick={() => onOptionClick(option)}
                                    />
                                </li>
                            )
                        }}
                    />
                )}
            </ul>

            {footer}
        </View>
    )
})

export type SelectListVirtual = {
    maxHeight: number
    itemHeight: number
}

export type SelectOption = {
    key: string | number
    label: string
    suffix?: any
    prefix?: any
    disabled?: boolean
    customContent?: any
    sticky?: boolean
} & any

export type SelectOptionProps = {
    option: SelectOption
    selected?: boolean
    onOptionClick?: any
}

export const SelectListOption = (props: SelectOptionProps) => {
    const { option, selected, onOptionClick } = props
    const { key, label, disabled, suffix, prefix, customContent } = option
    const className = classNames({
        'f-select-list-option': true,
        'f-row': true,
        'is-disabled': disabled,
        'is-selected': selected,
    })

    if (customContent) return customContent

    return (
        <p
            className={className}
            onClick={!disabled ? onOptionClick : null}>
            {selected && <span className="f-select-list-option__active" />}
            <span className="f-select-list-option__prefix f-row">
                <IconLib
                    icon="check"
                    style={{ visibility: selected ? 'visible' : 'hidden' }}
                />
            </span>
            {prefix && <span className="f-select-list-option__prefix f-row">{prefix}</span>}
            <Text
                as="span"
                className="f-select-list-option__label"
                dangerouslySetInnerHTML={{ __html: label }}
            />
            {suffix && <span className="f-select-list-option__suffix f-row">{suffix}</span>}
        </p>
    )
}
