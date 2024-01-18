import { CoreViewProps } from '../types'
import { classNames, renderChildren } from '../helpers'
import React, { ReactElement } from 'react'
import { View, Divider, ViewProps } from '..'

export type CardProps = {
    header?: ReactElement
    footer?: ReactElement
} & CoreViewProps

export const Card = (props: CardProps) => {
    const { header, footer, ...rest } = props
    const { width = 300, height = 'fit-content' } = rest
    const className = classNames(
        {
            'f-card': true,
        },
        [props.className]
    )

    return (
        <View
            {...{ width, height, ...rest }}
            className={className}>
            {props.header && <div className="f-card__header">{props.header}</div>}
            {props.children}
            {props.footer && <div className="f-card__footer">{props.footer}</div>}
        </View>
    )
}

export type CardListProps = CardProps

export const CardList = (props: CardListProps) => {
    return (
        <Card {...props}>
            {renderChildren(props.children, (child: ReactElement, index: number) => (
                <>
                    {index != 0 && <Divider />}
                    {child}
                </>
            ))}
        </Card>
    )
}

export type CardListItemProps = ViewProps

export const CardListItem = (props: CardListItemProps) => <View {...props} />
