import React, { forwardRef, ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
    Avatar,
    ComboInput,
    ComboInputField,
    ComboInputFieldProps,
    ComboInputProps,
    Input,
    InputControl,
    InputPrefix,
    InputProps,
    InputSuffix,
    Pill,
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
    filterDelay?: number
    inputProps?: InputProps
    prefix?: any
    suffix?: any
    comboInputProps?: ComboInputProps
    comboInputFieldProps?: ComboInputFieldProps
    selectListProps?: SelectListProps
    virtualProps?: SelectListVirtual
    optionComponent?: any
    noOptionsComponent?: any
    render?: any
    combo?: boolean
} & Omit<CoreViewProps, 'onSelect'>

export const Select = (props: SelectProps) => {
    const {
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
        filterDelay = 1000,
        inputProps,
        prefix,
        suffix,
        comboInputProps = {},
        comboInputFieldProps = {},
        selectListProps = {},
        virtualProps = { maxHeight: 300, itemHeight: 35 },
        optionComponent,
        noOptionsComponent,
        render,
        combo,
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

    const handleHideDropdown = (e) => {
        const { isEscape } = getKey(e)
        if (isEscape) dismiss()
    }

    const handleClickOutside = (e) => {
        if (containerRef.current) {
            if (!containerRef.current?.contains(e.target)) {
                dismiss()
            }
        }
    }

    const handleKeyDown = (e) => {
        const { isUp, isDown, isEnter } = getKey(e)

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
        if (combo) {
            return (
                <ComboInput
                    size={size}
                    id={popupId}
                    disabled={disabled}
                    onFocus={handleFocus}
                    className="f-select"
                    render={render}
                    {...comboInputProps}>
                    <ComboInputField
                        value={text}
                        onChange={handleChange}
                        placeholder={placeholder}
                        {...comboInputFieldProps}
                    />
                </ComboInput>
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

    useEvent('keydown', handleHideDropdown, true)
    useEvent('click', handleClickOutside, true)

    useEffect(() => {
        setTimer(() => {
            if (onFilter && !!text) onFilter(text)
        }, filterDelay)
    }, [text])

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

/**
 * Select menus
 */

export type LabelSelectLabel = {
    id: string | number
    icon?: string
    color?: string
    subtle?: boolean
    text: string
}

export type LabelSelectProps = {
    size?: Size
    enableNotFound?: boolean
    variant?: 'default' | 'static'
    labels: LabelSelectLabel[]
    inputPlaceholder?: string
    actionPrefix?: string
    availableLabels?: LabelSelectLabel[]
    onLabelAdd: any
    onLabelDelete: any
    onFilter?: any
} & Omit<SelectProps, 'placeholder' | 'selected' | 'options' | 'onSelect'>

export const LabelSelect = (props: LabelSelectProps) => {
    const {
        size,
        enableNotFound,
        variant = 'static',
        labels = [],
        availableLabels = [],
        inputPlaceholder = 'Filter labels',
        comboInputFieldProps = {},
        actionPrefix = 'Create',
        onLabelAdd,
        onLabelDelete,
        onFilter,
        ...rest
    } = props
    const selected = useMemo(() => labels.map((label: LabelSelectLabel) => label.id), [labels])
    const [notFound, setNotFound] = useState<any>(null)
    const options: any = useMemo(() => {
        const labels: any = availableLabels.map((label: LabelSelectLabel) => ({
            key: label.id,
            label: label.text,
            suffix: (
                <IconLib
                    icon={label.icon || 'tag'}
                    color={label.color}
                />
            ),
        }))

        if (notFound && enableNotFound) {
            labels.push({
                key: notFound,
                label: `${actionPrefix} <strong>${notFound}</strong>`,
                suffix: (
                    <IconLib
                        icon="plus"
                        strokeWidth={2}
                    />
                ),
                sticky: true,
            })
        }

        return labels
    }, [notFound, availableLabels])

    const handleInputKeyDown = (e) => {
        const { isBackspace } = getKey(e)
        if (isBackspace && !e.target.value) onLabelDelete(labels[labels.length - 1])
    }

    return (
        <Select
            {...rest}
            combo
            size={size}
            variant={variant}
            placeholder={inputPlaceholder}
            selected={selected}
            options={options}
            filterDelay={1000}
            selectListProps={{
                noOptionsComponent: <Text p="var(--f-select-option-padding)">No labels available</Text>,
            }}
            comboInputFieldProps={{ ...comboInputFieldProps, onKeyDown: handleInputKeyDown }}
            onSelect={(option, dismiss, clear) => {
                if (!!labels.find((label: any) => label.id == option.key)) return
                clear()
                onLabelAdd(availableLabels.find((availableLabel: any) => availableLabel.id == option.key))
                if (notFound) setNotFound(null)
            }}
            onFilter={(text: string) => {
                onFilter(text)
                setNotFound(
                    options.filter((option) => option.label.toLowerCase().includes(text.toLowerCase())).length == 0
                        ? text
                        : null
                )
            }}
            render={() =>
                labels.map((label: LabelSelectLabel, index: number) => (
                    <Pill
                        key={index}
                        color={label.color}
                        subtle={label.subtle}
                        size={size}
                        suffix={
                            <IconLib
                                icon="x"
                                className="f-buttonize"
                                onClick={() => onLabelDelete(label)}
                            />
                        }>
                        {label.text}
                    </Pill>
                ))
            }
        />
    )
}

export type UserSelectUser = {
    id: string | number
    name: string
    image?: string
}

export type UserSelectProps = {
    enableNotFound?: boolean
    users: UserSelectUser[]
    inputPlaceholder?: string
    actionPrefix?: string
    availableUsers?: UserSelectUser[]
    onUserAdd: any
    onUserDelete: any
    onFilter?: any
} & Omit<SelectProps, 'placeholder' | 'selected' | 'options' | 'onSelect'>

export const UserSelect = (props: UserSelectProps) => {
    const {
        size,
        enableNotFound,
        variant = 'static',
        users = [],
        availableUsers = [],
        inputPlaceholder = 'Filter users',
        comboInputFieldProps = {},
        actionPrefix = 'Add',
        onUserAdd,
        onUserDelete,
        onFilter,
        ...rest
    } = props
    const selected = useMemo(() => users.map((user: UserSelectUser) => user.id), [users])
    const [notFound, setNotFound] = useState<any>(null)
    const options: any = useMemo(() => {
        const users: any = availableUsers.map((user: UserSelectUser) => ({
            key: user.id,
            label: user.name,
            prefix: (
                <Avatar
                    src={user.image}
                    name={user.name}
                    size="xs"
                />
            ),
        }))

        if (notFound && enableNotFound) {
            users.push({
                key: notFound,
                label: `${actionPrefix} <strong>${notFound}</strong>`,
                suffix: (
                    <IconLib
                        icon="plus"
                        strokeWidth={2}
                    />
                ),
                sticky: true,
            })
        }

        return users
    }, [notFound, availableUsers])

    const handleInputKeyDown = (e) => {
        const { isBackspace } = getKey(e)
        if (isBackspace && !e.target.value) onUserDelete(users[users.length - 1])
    }

    return (
        <Select
            {...rest}
            combo
            size={size}
            variant={variant}
            placeholder={inputPlaceholder}
            selected={selected}
            options={options}
            filterDelay={1000}
            selectListProps={{ noOptionsComponent: <Text p="var(--f-select-option-padding)">No users available</Text> }}
            comboInputFieldProps={{ ...comboInputFieldProps, onKeyDown: handleInputKeyDown }}
            onSelect={(option, dismiss, clear) => {
                if (!!users.find((user: any) => user.id == option.key)) return
                clear()
                onUserAdd(availableUsers.find((availableUser: any) => availableUser.id == option.key))
                if (notFound) setNotFound(null)
            }}
            onFilter={(text: string) => {
                onFilter(text)
                setNotFound(
                    options.filter((option) => option.label.toLowerCase().includes(text.toLowerCase())).length == 0
                        ? text
                        : null
                )
            }}
            render={() =>
                users.map((user: UserSelectUser, index: number) => (
                    <Pill
                        key={index}
                        subtle
                        size={size}
                        prefix={
                            <Avatar
                                src={user.image}
                                name={user.name}
                                size="xs"
                            />
                        }
                        suffix={
                            <IconLib
                                icon="x"
                                className="f-buttonize"
                                onClick={() => onUserDelete(user)}
                            />
                        }>
                        {user.name}
                    </Pill>
                ))
            }
        />
    )
}
