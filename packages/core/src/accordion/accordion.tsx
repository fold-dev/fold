import React, { cloneElement, ReactElement, useEffect, useMemo, useState } from 'react'
import { Collapsible, Heading, HeadingProps, Headings, useId, View } from '..'
import { classNames, renderChildren } from '../helpers'
import { FIChevronDown } from '../icon'
import { Icon, IconLib } from '../icon/icon'
import { CoreViewProps, Size } from '../types'

export type AccordionProps = {
    disabled?: boolean
    uncontrolled?: boolean
    iconPosition?: 'start' | 'end'
    onChange?: any
} & CoreViewProps

export const Accordion = (props: AccordionProps) => {
    const { disabled, uncontrolled, iconPosition = 'end', onChange, ...rest } = props
    const [currentIndex, setCurrentIndex] = useState(-1)
    const className = classNames(
        {
            'f-accordion': true,
        },
        [props.className]
    )

    const handleClick = (index: number) => {
        if (onChange) onChange(index)
        setCurrentIndex(currentIndex == index ? -1 : index)
    }

    return (
        <View
            {...rest}
            className={className}>
            {renderChildren(props.children, (child: ReactElement, index: number) => {
                return cloneElement(child, {
                    iconPosition,
                    uncontrolled,
                    open: uncontrolled ? child.props.open : currentIndex == index,
                    disabled: disabled || child.props.disabled,
                    onClick: () => handleClick(index),
                    ...child.props,
                })
            })}
        </View>
    )
}

export type AccordionItemProps = {
    uncontrolled?: boolean
    collapsed?: boolean
    iconPosition?: 'start' | 'end'
    icons?: AccordionIcons
    defaultIcon?: any
    disabled?: boolean
    open?: boolean
    onClick?: any
} & CoreViewProps

export const AccordionItem = (props: AccordionItemProps) => {
    const { uncontrolled, collapsed, iconPosition, icons, defaultIcon, disabled, open, onClick, ...rest } = props
    const id = useId()
    const [innerOpen, setInnerOpen] = useState(collapsed)
    const isOpen = uncontrolled ? uncontrolled && innerOpen : open
    const { heading, panel } = useMemo(() => {
        return React.Children.toArray(props.children).reduce((acc: any, val: ReactElement) => {
            switch (val.type) {
                case AccordionHeading:
                    return { ...acc, heading: val }
                case AccordionPanel:
                    return { ...acc, panel: val }
                default:
                    return acc
            }
        }, {})
    }, [props.children])
    const className = classNames(
        {
            'f-accordion__item': true,
            'is-closed': !isOpen,
            'is-active': isOpen,
            'is-disabled': disabled,
            'is-start': iconPosition == 'start',
            'is-custom': !!icons,
        },
        [props.className]
    )

    const handleClick = (e) => {
        if (disabled) return
        if (onClick) onClick()
        if (uncontrolled) setInnerOpen(!innerOpen)
    }

    useEffect(() => {
        setInnerOpen(collapsed)
    }, [collapsed])

    return (
        <View
            {...rest}
            className={className}>
            {cloneElement(heading, {
                id,
                defaultIcon,
                open: isOpen,
                disabled,
                iconPosition,
                icons,
                onClick: handleClick,
                ...heading.props,
            })}

            {cloneElement(panel, {
                open: isOpen,
                id,
                ...panel.props,
            })}
        </View>
    )
}

export type AccordionIcons = {
    open: string
    closed: string
}

export type AccordionHeadingProps = {
    id?: string
    as?: Headings
    onClick?: any
    open?: boolean
    disabled?: boolean
    icons?: AccordionIcons
    iconSize?: Size
    defaultIcon?: string
    iconPosition?: 'start' | 'end'
} & CoreViewProps

export const AccordionHeading = (props: AccordionHeadingProps) => {
    const {
        id,
        as = 'h3',
        onClick,
        open,
        disabled,
        icons,
        iconSize = 'md',
        iconPosition = 'end',
        defaultIcon = 'chevron-down',
        ...rest
    } = props
    const icon = icons ? (open ? icons.open : icons.closed) : defaultIcon

    return (
        <Heading
            {...rest}
            as={as}
            role="heading"
            display="block"
            className="f-accordion-heading">
            <button
                role="button"
                type="button"
                disabled={disabled}
                aria-disabled={disabled}
                onClick={onClick}
                aria-expanded={open}
                aria-controls={id}
                className="f-accordion-heading__heading f-row">
                {iconPosition == 'start' && (
                    <IconLib
                        icon={icon}
                        size={iconSize}
                        className="f-accordion-heading__heading-icon"
                    />
                )}
                <span className="f-accordion-heading__heading-text">{props.children}</span>
                {iconPosition == 'end' && (
                    <IconLib
                        icon={icon}
                        size={iconSize}
                        className="f-accordion-heading__heading-icon"
                    />
                )}
            </button>
        </Heading>
    )
}

export type AccordionPanelProps = {
    id?: string
    /**
     * default open state for AccodrionPanel
     * @description defaults to false
     **/
    open?: boolean
} & CoreViewProps

export const AccordionPanel = (props: AccordionPanelProps) => {
    const { open, id, ...rest } = props

    return (
        <Collapsible
            {...rest}
            role="region"
            open={open}
            id={id}
            className="f-accordion__content"
            aria-labelledby={id}>
            <div className="f-accordion__content-inner">{props.children}</div>
        </Collapsible>
    )
}
