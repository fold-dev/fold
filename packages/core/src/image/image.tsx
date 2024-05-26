import React, { forwardRef, ReactNode, useEffect, useMemo, useState } from 'react'
import { IconLib, SpinnerOverlay, View } from '..'
import { classNames, documentObject } from '../helpers'
import { CoreViewProps } from '../types'

export const ImagePlaceholder = ({ width, height, component = null }) => {
    const Component = component ? component : null

    return (
        <div
            style={{ width, height }}
            className="f-row f-image-placeholder">
            {Component && <Component />}
            {!component && (
                <IconLib
                    icon="image"
                    className="f-image-placeholder__icon"
                />
            )}
        </div>
    )
}

export type ImageProps = {
    errorContent?: ReactNode
    src?: string
    objectPosition?: string
    objectFit?: 'contain' | 'cover' | 'fill'
    alt?: string
    loading?: 'eager' | 'lazy'
    crossOrigin?: 'anonymous' | 'use-credentials'
    srcSet?: string
    /**
     * Size of the input
     * @default md
     * @type   xs | sm | md | lg | xl
     */
    sizes?: string
    fallbackSrc?: string
    loader?: boolean
    imageProps?: any
    placeholder?: any
    placeholderComponent?: any
} & CoreViewProps

export const TRANSPARENT_GIF = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

export const Image = forwardRef((props: ImageProps, ref) => {
    const {
        // from CoreViewProps:
        width = '100%',
        height = '100%',
        // from ImageProps:
        src = '',
        objectPosition,
        objectFit,
        alt,
        loading,
        crossOrigin,
        srcSet = [],
        sizes,
        fallbackSrc = TRANSPARENT_GIF,
        loader = true,
        imageProps,
        placeholder,
        placeholderComponent,
        errorContent,
        ...rest
    } = props
    const isEmpty = useMemo(() => src == '' && srcSet.length == 0, [src, srcSet.length])
    const [source, setSource] = useState(fallbackSrc)
    const [loading1, setLoading1] = useState(true)
    const [error, setError] = useState(false)
    const isLoading = loading1 && !!loader
    const className = classNames(
        {
            'f-image': true,
            'is-loading': isLoading,
        },
        [props.className]
    )

    useEffect(() => {
        setLoading1(true)
        const image = documentObject.createElement('img')
        if (isEmpty) {
            setLoading1(false)
            setError(true)
        } else {
            image.src = src
            image.onerror = function (e) {
                setLoading1(false)
                setError(true)
            }
            image.onload = function (e) {
                if (!this.naturalHeight && !this.naturalWidth) {
                    setLoading1(false)
                    setError(false)
                } else {
                    setSource(src)
                    setLoading1(false)
                    setError(false)
                }
            }
        }
    }, [isEmpty])

    return (
        <View
            {...rest}
            width={width}
            height={height}
            className={className}
            as="span">
            {/* if there is no placeholder & is loading */}
            {isLoading && !placeholder && <SpinnerOverlay size="sm" />}

            {/* if there is a placeholder & is loading */}
            {/* or if there is no source & a placaholder */}
            {((isLoading && placeholder) || (isEmpty && placeholder)) && (
                <ImagePlaceholder
                    width={width}
                    height={height}
                    component={placeholderComponent}
                />
            )}

            {error && <span className="f-image__error f-col">{errorContent}</span>}

            {/* if there is a source & is not loading */}
            {!isEmpty && !loading1 && (
                <img
                    ref={ref}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    loading={loading}
                    crossOrigin={crossOrigin}
                    src={source}
                    width={width}
                    height={height}
                    style={{
                        width,
                        height,
                        objectFit,
                        objectPosition,
                    }}
                    {...imageProps}
                />
            )}
        </View>
    )
})
