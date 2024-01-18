import React from 'react'
import { View } from '../'
import { classNames } from '../helpers'
import { IconLib } from '../icon/icon'
import { CoreViewProps } from '../types'

export type TimelineItemProps = {
    marker?: any
} & CoreViewProps

export const TimelineItem = (props: TimelineItemProps) => {
    const { marker, ...rest } = props
    const className = classNames(
        {
            'f-timeline-item': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}>
            <div className="f-timeline-item__marker">
                {marker ? (
                    marker
                ) : (
                    <IconLib
                        icon="circle"
                        size="sm"
                    />
                )}
            </div>
            <div className="f-timeline-item__content">{props.children}</div>
        </View>
    )
}

export type TimelineProps = {} & CoreViewProps

export const Timeline = (props: TimelineProps) => {
    const { ...rest } = props
    const className = classNames(
        {
            'f-timeline': true,
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
