import React, { forwardRef, ReactNode, useEffect, useState } from 'react'
import { SpinnerOverlay, View } from '..'
import { CoreViewProps } from '../types'
import { classNames, documentObject } from '../helpers'

export type VideoSource = {
    src: string
    type?: string
}

export type VideoProps = {
    errorContent?: ReactNode
    srcs: VideoSource[]
    objectPosition?: string
    objectFit?: 'contain' | 'cover' | 'fill'
    muted?: boolean
    controls?: boolean
    autoPlay?: boolean
    loader?: boolean
    poster?: string
    videoProps?: any
} & CoreViewProps

const VideoComponent = forwardRef((props: VideoProps, ref) => {
    const {
        // from CoreViewProps:
        width = '100%',
        height = '100%',
        // from VideoProps:
        srcs = [],
        objectPosition,
        objectFit,
        muted,
        controls,
        autoPlay,
        loader,
        poster,
        videoProps,
        errorContent,
        ...rest
    } = props
    const [sources, setSources] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const isLoading = loading && !!loader
    const className = classNames(
        {
            'f-video': true,
            'is-loading': isLoading,
        },
        [props.className]
    )

    useEffect(() => {
        setLoading(true)
        const video = documentObject.createElement('video')
        video.src = srcs[0].src
        video.onerror = function (e) {
            setLoading(false)
            setError(true)
        }
        video.onloadeddata = () => {
            setSources(srcs)
            setLoading(false)
            setError(false)
        }
    }, [srcs])

    return (
        <View
            width={width}
            height={height}
            {...rest}
            className={className}>
            {isLoading && <SpinnerOverlay size="sm" />}

            {error && <span className="f-video__error f-col">{errorContent}</span>}

            <video
                ref={ref}
                autoPlay={autoPlay}
                poster={poster}
                muted={muted}
                controls={controls}
                width={width}
                height={height}
                style={{
                    width,
                    height,
                    objectFit,
                    objectPosition,
                }}
                {...videoProps}>
                {sources.map((source: VideoSource, index: number) => (
                    <source
                        key={index}
                        src={source.src}
                        type={source.type}
                    />
                ))}
                Video is not supported
            </video>
        </View>
    )
})

export const Video = React.memo(VideoComponent)
