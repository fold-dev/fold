import React from 'react'
import { View } from '..'
import { classNames } from '../helpers'
import { CoreViewProps } from '../types'

export type HeaderProps = {} & CoreViewProps

export const Header = (props: HeaderProps) => {
    const { ...rest } = props
    const className = classNames(
        {
            'f-header': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            as="header"
            className={className}
            row
        />
    )
}

export type FooterProps = {} & CoreViewProps

export const Footer = (props: HeaderProps) => {
    const { ...rest } = props
    const className = classNames(
        {
            'f-footer': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            as="footer"
            className={className}
            row
        />
    )
}

export type AppProps = {} & CoreViewProps

export const App = (props: AppProps) => {
    const { ...rest } = props
    const className = classNames(
        {
            'f-app': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            position="relative"
            alignItems="stretch"
            className={className}
        />
    )
}

export type MainProps = {} & CoreViewProps

export const Main = (props: MainProps) => {
    const { ...rest } = props
    const className = classNames(
        {
            'f-main': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}
            flex={1}
        />
    )
}

export type ContentProps = {} & CoreViewProps

export const Content = (props: ContentProps) => {
    const { ...rest } = props
    const className = classNames(
        {
            'f-content': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}
            flex={1}
            row
        />
    )
}

export type SidebarProps = {
    left?: boolean
    right?: boolean
} & CoreViewProps

export const Sidebar = (props: SidebarProps) => {
    const { left, right, ...rest } = props
    const className = classNames(
        {
            'f-sidebar': true,
            'is-left': left,
            'is-right': right,
            'f-col': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}
        />
    )
}
