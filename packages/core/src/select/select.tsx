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
    useFocus,
    useId,
    useTimer,
    useVisibility,
    View,
    Virtual,
} from '../'
import {
    classNames,
    documentObject,
    executeLast,
    focusElement,
    focusElementById,
    getBoundingClientRect,
    getKey,
    isBoxOffScreen,
    mergeRefs,
    scrollToCenter,
    waitForRender,
} from '../helpers'
import { IconLib } from '../icon'
import { CoreViewProps, Size } from '../types'

export type SelectProps = {
    openOnFocus?: boolean
    openOnMount?: boolean
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
    selectPopoverProps?: any
    virtualProps?: SelectListVirtual
    optionComponent?: any
    noOptionsComponent?: any
    render?: any
    tagInput?: boolean
} & Omit<CoreViewProps, 'onSelect'>

export const Select = (props: SelectProps) => {
    const {
        openOnFocus,
        openOnMount,
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
        selectPopoverProps = {},
        virtualProps = { maxHeight: 300, itemHeight: 35 },
        optionComponent,
        noOptionsComponent,
        render,
        tagInput,
        ...rest
    } = props
    const selectedAmount = selected.length
    const isStatic = variant == 'static'
    const isFilterable = !!onFilter
    const { show, hide, visible } = useVisibility(isStatic)
    const { setTimer, clearTimer } = useTimer()
    const popupId = useId()
    const popoverRef = useRef(null)
    const listRef = useRef(null)
    const popupContentId = useId()
    const containerRef = useRef(null)
    const mountedRef = useRef(false)
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
    const tagInputFieldRef = useRef(null)
    const dontShowListPopup = useRef(false)
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

    const handleClick = (e) => {
        if (!visible) {
            show()
            // make sure to focus the right element
            if (tagInput) {
                focusElement(tagInputFieldRef.current)
            } else {
                focusElementById(popupId)
            }
        }
    }

    const handleFocus = (e) => {
        if (dontShowListPopup.current) return
        if (!visible && openOnFocus) show()
    }

    const clear = () => {
        setText('')
    }

    const dismiss = (refocus = true) => {
        if (!isStatic) {
            hide()
            // we simply want to focus the element again
            // and not show the list
            if (refocus) {
                dontShowListPopup.current = true
                if (tagInput) {
                    focusElement(tagInputFieldRef.current)
                } else {
                    focusElementById(popupId)
                }
                dontShowListPopup.current = false
            }
        }
        clear()
    }

    const handleOptionClick = (option: SelectOption) => {
        if (!option) return
        if (option.disabled) return
        onSelect(option, dismiss, clear)
        // refocus the elment because the forced scrolling (useEffect)
        // causes the element to lose focus
        if (as == 'virtual') {
            if (isFilterable) {
                if (tagInput) {
                    focusElement(tagInputFieldRef.current)
                } else {
                    focusElementById(popupId)
                }
            } else {
                focusElementById(popupContentId)
            }
        }
    }

    const handleClickOutside = (e) => {
        if (containerRef.current) {
            if (!containerRef.current?.contains(e.target)) {
                if (visible) dismiss(false)
            }
        }
    }

    const handleKeyDownInput = (e) => {
        const { isEnter } = getKey(e)

        if (isEnter && !visible) {
            e.preventDefault()
            e.stopPropagation()
            show()
        }
    }

    const handleKeyDown = (e) => {
        const { isUp, isDown, isEnter, isEscape, isTabNormal, isTabReverse } = getKey(e)

        if (isEscape && visible) {
            e.preventDefault()
            e.stopPropagation()
            dismiss()
        }

        if (isUp || isDown || isEnter) {
            e.preventDefault()
            e.stopPropagation()
            if (isUp) setCursor(cursor == 0 ? filteredOptions.length - 1 : cursor - 1)
            if (isDown) setCursor(cursor == filteredOptions.length - 1 ? 0 : cursor + 1)
            if (isEnter) handleOptionClick(filteredOptions[cursor])
            if (as == 'default') scrollIntoView()
        }

        // this makes the trapFocus usage almost redundant
        // TODO: find a more graceful way to trap focus with overriding events
        // 1) filterable selects need focus on the input element (not just option)
        //    downside is that reverse-tabbing tabs to the previous element
        // 2) virtual elements behave similarly
        if ((isTabNormal || isTabReverse) && visible) {
            e.preventDefault()
            e.stopPropagation()
            if (isTabReverse) setCursor(cursor == 0 ? filteredOptions.length - 1 : cursor - 1)
            if (isTabNormal) setCursor(cursor == filteredOptions.length - 1 ? 0 : cursor + 1)
            if (as == 'default') scrollIntoView()
        }
    }

    const scrollIntoView = () => {
        executeLast(() => {
            scrollToCenter(listRef.current?.querySelector(`.is-focused`))
        })
    }

    useEvent('click', handleClickOutside, true)

    // manages the onFilter
    useEffect(() => {
        if (mountedRef.current) {
            setTimer(() => {
                if (onFilter && !!text) onFilter(text)
            }, filterDelay)
        }
    }, [text])

    // callbacks for onOpen & onClose (after mount)
    useEffect(() => {
        if (mountedRef.current) {
            if (visible) {
                if (onOpen) onOpen()
            } else {
                if (onClose) onClose()
            }
        }
    }, [visible])

    // resets the cursor
    useEffect(() => {
        setCursor(0)
    }, [text, visible])

    // manages the scroll for the virutal list
    // similar to scrollCursorIntoView()
    // we do it here because we need the correct cursor (after it updates)
    useEffect(() => {
        if (as == 'virtual') {
            const virtual = listRef.current?.querySelector(`.f-virtual`)
            virtual?.scrollTo(0, virtualProps.itemHeight * cursor)
        }
    }, [cursor])

    // static (always open)
    useLayoutEffect(() => {
        if (!visible) return
        if (variant == 'static') return
        const { bottom, left } = getBoundingClientRect(containerRef.current)
        const { width, height } = getBoundingClientRect(popoverRef.current)
        setOffscreen(isBoxOffScreen({ top: bottom, left, width, height }).y)
    }, [visible, variant])

    // opens the list when mounted
    useEffect(() => {
        if (!visible && openOnMount) show()
    }, [openOnMount])

    // set the mounted flag
    useEffect(() => {
        mountedRef.current = true
    }, [])

    return (
        <View
            {...rest}
            ref={containerRef}
            className={containerClassName}
            onKeyDown={handleKeyDown}>
            {tagInput && (
                <TagInput
                    size={size}
                    id={popupId}
                    disabled={disabled}
                    onKeyDown={handleKeyDownInput}
                    onClick={handleClick}
                    className="f-select"
                    render={render}                    
                    {...tagInputProps}>
                    <TagInputField
                        value={text}
                        ref={tagInputFieldRef}
                        readOnly={readOnly || !visible}
                        // Edge case: losing focus will happen when clicking on list buttons
                        // onBlur={dismiss}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        placeholder={placeholder}
                        {...tagInputFieldProps}
                    />
                </TagInput>
            )}

            {!tagInput && (
                <InputControl
                    onClick={handleClick}
                    onKeyDown={handleKeyDownInput}
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
                        // Edge case: losing focus will happen when clicking on list buttons
                        // onBlur={(e) => isFilterable ? hide() : null}
                        onChange={handleChange}
                        onKeyDown={handleKeyDownInput}
                        className={className}
                        disabled={disabled}
                        readOnly={readOnly || !visible}
                        {...inputProps}
                    />
                    {suffix && <InputSuffix>{suffix}</InputSuffix>}
                </InputControl>
                
            )}

            {visible && (
                <div
                    ref={popoverRef}
                    className={popoverClassName}
                    {...selectPopoverProps}>
                    <SelectList
                        noFocus={noListFocus || isFilterable}
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
                        onCursorUpdate={setCursor}
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
    const { trapFocus } = useFocus()
    const className = classNames({
        'f-select-list': true,
        'is-virtual': isVirtual,
    })

    useEffect(() => {
        if (!noFocus) {
            containerRef.current?.focus()
            // we manually manage the tabbing for virtual list
            if (as == 'default') waitForRender(() => trapFocus(containerRef.current), 10)
        }
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

    const handleClick = (e) => {
        if (!disabled) onOptionClick()
    }

    return (
        <p
            className={className}
            onClick={handleClick}>
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
