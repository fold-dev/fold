import React, { useMemo } from 'react'
import { View } from '..'
import { classNames } from '../helpers'
import { CoreViewProps } from '../types'

export type AspectRatioProps = {
    width?: number | string
    height?: number | string
    ratio: number
} & CoreViewProps

export const AspectRatio = (props: AspectRatioProps) => {
    const { width, height, ratio, style = {}, ...rest } = props
    const { w, h } = useMemo(() => {
        const iwidth: string = String(width || '')
        const iheight: string = String(height || '')
        const widthNumber = width ? parseInt(iwidth) : null
        const heightNumber = height ? parseInt(iheight) : null
        const unit = widthNumber
            ? iwidth.replace(String(widthNumber), '')
            : heightNumber
            ? iheight.replace(String(heightNumber), '')
            : ''
        const finalWidth = widthNumber ? widthNumber : Math.round(heightNumber / ratio)
        const finalHeight = heightNumber ? heightNumber : Math.round(widthNumber * ratio)

        // Make sure its the right format for the React style
        if (unit == '') {
            return {
                w: finalWidth,
                h: finalHeight,
            }
        } else {
            return {
                w: `${finalWidth}${unit}`,
                h: `${finalWidth}${unit}`,
            }
        }
    }, [])
    const className = classNames(
        {
            'aspect-ratio': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}
            style={{ ...style, width: w, height: h }}
        />
    )
}
