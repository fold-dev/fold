import React, { forwardRef, useEffect, useMemo, useState } from 'react'
import { IconLib, Image, ImageProps, View } from '../'
import { classNames, cleanObject, documentObject, getForegroundColor } from '../helpers'
import { Text, TextProps } from '../text/text'
import { CoreViewProps, Size } from '../types'

export type AvatarProps = {
    subtle?: boolean
    size?: Size
    color?: string
    icon?: string
    name?: string
    src?: string
    textProps?: TextProps
    imageProps?: ImageProps
} & CoreViewProps

export const Avatar = forwardRef((props: AvatarProps, ref) => {
    const {
        subtle,
        size = 'md',
        color,
        icon,
        name = '',
        src,
        imageProps = {},
        style = {},
        textProps = {},
        ...rest
    } = props
    const initials = useMemo(() => {
        return name
            .split(' ')
            .splice(0, 2)
            .map((str: string) => str.charAt(0))
            .join('')
            .toUpperCase()
    }, [name])
    const styles = useMemo(() => {
        if (color) {
            const foreground = getForegroundColor(color)
            const background = color
            return cleanObject({
                ...style,
                color: subtle ? background : foreground,
                backgroundColor: subtle ? foreground : background,
            })
        } else {
            return cleanObject({ ...style })
        }
    }, [color, style])
    const className = classNames(
        {
            'f-avatar': true,
            'f-row': true,
        },
        [props.className, size]
    )
    const [imageFailed, setImageFailed] = useState(false)
    const validSrc = src && !imageFailed

    useEffect(() => {
        setImageFailed(false)
        const image = documentObject.createElement('img')
        image.src = src
        image.onerror = (e) => setImageFailed(true)
    }, [src])

    return (
        <View
            {...rest}
            className={className}
            style={styles}
            as="span"
            ref={ref}>
            {/* If there is a picture */}
            {validSrc && (
                <Image
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    src={src}
                    loader
                    alt={name}
                    {...imageProps}
                />
            )}

            {/* If there is an icon */}
            {icon && (
                <IconLib
                    icon={icon}
                    size={size}
                />
            )}

            {/* If there is no picture or icon */}
            {!validSrc && !icon && (
                <Text
                    as="span"
                    size={size}
                    {...textProps}>
                    {initials}
                </Text>
            )}

            {/* Otherwise, display children */}
            {props.children}
        </View>
    )
})

export type AvatarGroupProps = {
    animated?: boolean
    invert?: boolean
} & CoreViewProps

export const AvatarGroup = forwardRef((props: AvatarGroupProps, ref) => {
    const { animated, invert, ...rest } = props
    const className = classNames(
        {
            'f-avatar-group': true,
            'f-row': true,
            'is-animated': animated,
            'is-inverted': invert,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}
            ref={ref}>
            {props.children}
        </View>
    )
})
