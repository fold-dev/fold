import React, { cloneElement, createElement, ReactElement, ReactNode } from 'react'
import { Link, View } from '../'
import { classNames, renderChildren, renderWithProps } from '../helpers'
import { CoreViewProps, Size } from '../types'

export type BreadcrumbItemProps = {
    separator?: ReactElement | ReactNode
    active?: boolean
    to?: string
    target?: string
    onClick?: any
    size?: Size
} & CoreViewProps

export const BreadcrumbItem = (props: BreadcrumbItemProps) => {
    const { active, to, target, separator, onClick, size, ...rest } = props
    const className = classNames(
        {
            'f-breadcrumb-item': true,
            'f-row': true,
            'is-active': active,
        },
        [props.className]
    )

    return (
        <Link
            {...rest}
            as="a"
            role="navitem"
            className={className}
            size={size}
            href={to}
            target={target}
            onClick={onClick}>
            <span className="f-breadcrumb-item__text">{props.children}</span>
            <span
                role="presentation"
                className="f-breadcrumb-item__separator f-row">
                {separator}
            </span>
        </Link>
    )
}

export type BreadcrumbProps = {
    separator?: ReactElement | ReactNode
    size?: Size
} & CoreViewProps

export const Breadcrumb = (props: BreadcrumbProps) => {
    const { size = 'md', separator = '/', ...rest } = props

    return (
        <View
            {...rest}
            as="nav"
            aria-label="Breadcrumb"
            className="f-breadcrumb f-row">
            {renderWithProps(props.children, { size, separator })}
        </View>
    )
}
