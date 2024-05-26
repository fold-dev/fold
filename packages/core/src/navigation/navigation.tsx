import React, { ReactElement, useRef, useState } from 'react'
import { Collapsible, Heading, HeadingProps, IconLib, Text, View } from '../'
import { classNames, renderWithProps } from '../helpers'
import { CoreViewProps, Size } from '../types'

export type NavigationProps = {
    variant?: 'navigation' | 'navbar'
} & CoreViewProps

export const Navigation = (props: NavigationProps) => {
    const { variant = 'navigation', ...rest } = props
    const isNavbar = variant == 'navbar'
    const role = isNavbar ? 'navbar' : 'navigation'
    const navigationRef = useRef(null)
    const className = classNames(
        {
            'f-navigation': true,
            'f-row': isNavbar,
            'is-navbar': isNavbar,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            as="nav"
            ref={navigationRef}
            className={className}
            role={role}>
            {renderWithProps(props.children, { variant })}
        </View>
    )
}

export type NavigationItemProps = {
    size?: Size
    variant?: 'navigation' | 'navbar'
    target?: string
    label?: string
    href?: string
    prefix?: ReactElement
    suffix?: ReactElement
    subNavigationOpen?: boolean
    subNavigation?: ReactElement
    innerContent?: ReactElement
    disabled?: boolean
    active?: boolean
    onClick?: any
    anchorProps?: Omit<CoreViewProps, 'ShorthandProps'>
} & CoreViewProps

export const NavigationItem = (props: NavigationItemProps) => {
    const {
        size,
        variant = 'navigation',
        target,
        label,
        href,
        prefix,
        suffix,
        subNavigationOpen = false,
        subNavigation,
        innerContent,
        disabled,
        active,
        onClick,
        anchorProps = {},
        ...rest
    } = props
    const navigationItemRef = useRef<any>()
    const [open, setOpen] = useState(subNavigationOpen)
    const hasSubNavigation = !!subNavigation && variant != 'navbar'
    const shouldOpenSubNavigation = !href && !onClick && !!subNavigation
    const className = classNames(
        {
            'f-navigation-item': true,
            'has-sub-navigation': hasSubNavigation,
            'is-open': open,
        },
        [props.className]
    )
    const classNameInner = classNames({
        'f-navigation-item__container': true,
        'f-row': true,
        'is-active': active,
        'is-disabled': disabled,
        'is-open': open,
    })

    const handleClick = (e) => {
        if (disabled) return
        if (shouldOpenSubNavigation) setOpen(!open)
        if (onClick) onClick(e)
    }

    const handleOpenClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setOpen(!open)
    }

    return (
        <View
            {...rest}
            as="span"
            role="navitem"
            className={className}>
            <a
                ref={navigationItemRef}
                href={href}
                target={target}
                aria-checked={active}
                aria-haspopup={false}
                aria-expanded={open}
                aria-label={label}
                className={classNameInner}
                onClick={handleClick}
                {...anchorProps}>
                {prefix && <span className="f-navigation-item__prefix f-row">{prefix}</span>}
                <Text
                    as="span"
                    className="f-navigation-item__label f-row"
                    size={size}>
                    {props.children}
                </Text>
                {suffix && <span className="f-navigation-item__suffix f-row">{suffix}</span>}
                {hasSubNavigation && (
                    <button
                        onClick={handleOpenClick}
                        className="f-navigation-item__suffix f-buttonize f-row">
                        <IconLib
                            size={size}
                            icon={open ? 'chevron-down' : 'chevron-left'}
                        />
                    </button>
                )}
            </a>

            {innerContent}

            {hasSubNavigation && (
                <Collapsible
                    open={open}
                    className="f-sub-navigation"
                    as="span">
                    <span className="f-navigation-item__sub-navigation_line" />
                    <span className="f-navigation-divider">--&nbsp;</span>
                    {renderWithProps(subNavigation, {
                        className: 'is-sub-navigation',
                    })}
                </Collapsible>
            )}
        </View>
    )
}

export type NavigationHeadingProps = {
    headingProps?: HeadingProps
    prefix?: ReactElement
    suffix?: ReactElement
} & CoreViewProps

export const NavigationHeading = (props: NavigationHeadingProps) => {
    const { prefix, suffix, headingProps = {}, ...rest } = props

    return (
        <View
            {...rest}
            as="span"
            role="presentation"
            className="f-navigation-heading f-row">
            {prefix && <span className="f-navigation-heading__prefix">{prefix}</span>}
            <Heading
                {...headingProps}
                as="h6"
                className="f-navigation-heading__heading f-ellipsis">
                {props.children}
            </Heading>
            {suffix && <span className="f-navigation-heading__suffix">{suffix}</span>}
        </View>
    )
}

export const NavigationSection = (props: CoreViewProps) => {
    return (
        <View
            {...props}
            as="span"
            role="presentation"
            className="f-navigation-section"
        />
    )
}

export const NavigationDivider = (props: CoreViewProps) => {
    return (
        <View
            {...props}
            as="span"
            role="seperator"
            className="f-navigation-divider">
            <hr />
        </View>
    )
}
