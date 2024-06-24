import React, { ReactElement, forwardRef, useMemo } from 'react'
import { Text, View } from '..'
import { addAlpha, classNames, cleanObject, getForegroundColor } from '../helpers'
import { CoreViewProps, Size } from '../types'

export type PillProps = {
    as?: 'button' | 'span'
    size?: Size
    outline?: boolean
    subtle?: boolean
    solid?: boolean
    color?: string
    prefix?: ReactElement
    suffix?: ReactElement
} & Omit<CoreViewProps, 'as'>

export const Pill = forwardRef((props: PillProps, ref) => {
    const { as = 'span', size = 'md', outline, subtle, solid, color, prefix, suffix, style = {}, ...rest } = props
    const isClickable = as == 'button'
    const styles = useMemo(() => {
        if (!color) return { ...style }

        let textColor = null
        let borderColor = null
        let backgroundColor = null
        const foregroundColor = getForegroundColor(color)

        if (!outline && !subtle && !solid) {
            textColor = foregroundColor
            backgroundColor = color
            borderColor = foregroundColor
        } else if (subtle) {
            textColor = color
            backgroundColor = addAlpha(color, 0.15)
        } else if (outline) {
            textColor = color
            borderColor = color
        } else if (solid) {
            textColor = foregroundColor
            backgroundColor = color
        }

        return cleanObject({
            ...style,
            'color': textColor,
            backgroundColor,
            '--f-pill-border-color': borderColor,
            'outlineColor': backgroundColor,
        })
    }, [color, outline, subtle, solid])
    const className = classNames(
        {
            'f-pill': true,
            'f-row': true,
            'f-buttonize': isClickable,
            'is-outline': outline,
            'is-subtle': subtle,
            'is-solid': solid,
        },
        [props.className, size]
    )

    return (
        <View
            ref={ref}
            as={as}
            {...rest}
            className={className}
            style={styles}>
            {prefix && <span className="f-pill__prefix f-row">{prefix}</span>}
            <Text
                as="span"
                size={size}
                className="f-pill__label f-row">
                {props.children}
            </Text>
            {suffix && <span className="f-pill__suffix f-row">{suffix}</span>}
        </View>
    )
})
