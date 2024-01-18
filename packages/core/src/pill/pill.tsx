import React, { ReactElement, forwardRef, useMemo } from 'react'
import { Text, View } from '..'
import { addAlpha, classNames, cleanObject, getForegroundColor } from '../helpers'
import { CoreViewProps, Size } from '../types'

export type PillProps = {
    size?: Size
    solid?: boolean
    outline?: boolean
    subtle?: boolean
    color?: string
    prefix?: ReactElement
    suffix?: ReactElement
} & CoreViewProps

export const Pill = forwardRef((props: PillProps, ref) => {
    const { size = 'md', solid, outline, subtle, color, prefix, suffix, style = {}, ...rest } = props
    const isClickable = !!props.onClick
    const accentColor = useMemo(() => {
        if (outline || subtle) return color
        return getForegroundColor(color)
    }, [color, outline, solid])
    const borderColor = color ? (subtle ? 'transparent' : outline ? color : 'transparent') : null
    const backgroundColor = color ? (outline || subtle ? addAlpha(color, 0.15) : color) : null
    const styles = cleanObject({
        ...style,
        color: accentColor,
        backgroundColor,
        borderColor,
        outlineColor: backgroundColor,
    })
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
            as={isClickable ? 'button' : 'span'}
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
