import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { Button, IconLib, SpinnerOverlay, View, useResize } from '..'
import { classNames, documentObject, getBoundingClientRect, windowObject } from '../helpers'
import { CoreViewProps } from '../types'

export type AudioSource = {
    src: string
    type?: string
}

export type AudioProps = {
    autoPlay?: boolean
    muted?: boolean
    controls?: boolean
    srcs: AudioSource[]
    loader?: boolean
    audioProps?: any
} & CoreViewProps

const AudioComponent = forwardRef((props: AudioProps, ref) => {
    const { autoPlay, muted, controls, srcs = [], loader, audioProps, ...rest } = props
    const [sources, setSources] = useState([])
    const [loading, setLoading] = useState(true)
    const isLoading = loading && !!loader
    const className = classNames(
        {
            'f-audio': true,
            'is-loading': isLoading,
        },
        [props.className]
    )

    useEffect(() => {
        setLoading(true)
        const audio = documentObject.createElement('audio')
        audio.src = srcs[0].src
        audio.onloadeddata = () => {
            setSources(srcs)
            setLoading(false)
        }
    }, [srcs])

    return (
        <View
            {...rest}
            className={className}>
            {isLoading && <SpinnerOverlay size="sm" />}

            <audio
                ref={ref}
                autoPlay={autoPlay}
                muted={muted}
                controls={controls}
                {...audioProps}>
                {sources.map((source: AudioSource, index: number) => (
                    <source
                        key={index}
                        src={source.src}
                        type={source.type}
                    />
                ))}
                Audio is not supported
            </audio>
        </View>
    )
})

export const Audio = React.memo(AudioComponent)

export type AudioWaveformProps = {
    defaultProgress?: number
    flatten?: boolean
    samples?: number
    src: AudioSource
    width?: number | string
    height?: number
    strokeWidth?: number
} & CoreViewProps

export const AudioWaveform = (props: AudioWaveformProps) => {
    const {
        defaultProgress = 0,
        flatten,
        src,
        width = '100%',
        height = 50,
        strokeWidth = 1,
        samples = 70,
        ...rest
    } = props
    const [data, setData] = useState([])
    const [box, setBox] = useState<any>({ height: 0, width: 0 })
    const [playing, setPlaying] = useState(false)
    const [loading, setLoading] = useState(true)
    const ref = useRef(null)
    const dimensions = useResize(ref.current)
    const audioRef = useRef(null)
    const [range, setRange] = useState(defaultProgress * 100)
    const className = classNames(
        {
            'f-audio-waveform': true,
            'f-row': true,
        },
        [props.className]
    )

    const play = () => {
        audioRef.current.play()
        setPlaying(true)
    }

    const pause = () => {
        audioRef.current.pause()
        setPlaying(false)
    }

    const handleTimeUpdate = () => {
        const { currentTime, duration } = audioRef.current
        const percent = Math.round((currentTime / duration) * 100)
        setRange(percent)
    }

    const handleRangeChange = (e) => {
        const { duration } = audioRef.current
        const percent = +e.target.value
        setRange(percent)
        audioRef.current.currentTime = (duration / 100) * percent
    }

    const handleButtonClick = (e) => {
        if (playing) {
            pause()
        } else {
            play()
        }
    }

    const filterData = (audioBuffer) => {
        const rawData = audioBuffer.getChannelData(0)
        const blockSize = Math.floor(rawData.length / samples)
        const filteredData = []
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i
            let sum = 0
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j])
            }
            filteredData.push(sum / blockSize)
        }
        return filteredData
    }

    const normalizeData = (filteredData) => {
        const multiplier = Math.pow(Math.max(...filteredData), -1)
        return filteredData.map((n) => n * multiplier)
    }

    const fetchAudio = (src: string) => {
        const { fetch, AudioContext, webkitAudioContext } = windowObject
        const FinalAudioContext = AudioContext || webkitAudioContext
        const audioContext = new FinalAudioContext()

        fetch(src)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
            .then((audioBuffer) => {
                setLoading(false)
                setData(normalizeData(filterData(audioBuffer)))
            })
    }

    const renderLine = useMemo(() => {
        const position = box.width / data.length

        return (
            <>
                {data.map((d: number, index: number) => {
                    const point = flatten ? 0.4 : d
                    const y1 = point * height
                    const y2 = height - y1
                    const x = index * position + strokeWidth

                    return (
                        <line
                            key={index}
                            x1={x}
                            x2={x}
                            y1={y1}
                            y2={y2}
                            strokeWidth={strokeWidth}
                            stroke="inherit"
                        />
                    )
                })}
            </>
        )
    }, [data, box, height, strokeWidth])

    const handleClick = (e) => {
        const box = getBoundingClientRect(ref.current)
        const x = e.clientX - box.left
        const percent = x / box.width
        setRange(percent * 100)
    }

    useEffect(() => {
        setBox(getBoundingClientRect(ref.current))
    }, [width, height, data, dimensions])

    useEffect(() => {
        setLoading(true)
        const audio = documentObject.createElement('audio')
        audio.src = src.src
        audio.onloadeddata = () => fetchAudio(src.src)
    }, [src])

    return (
        <View
            {...rest}
            className={className}
            width={width}
            height={height}>
            {loading && <SpinnerOverlay size="sm" />}

            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                style={{ display: 'none' }}>
                <source
                    src={src.src}
                    type={src.type}
                />
            </audio>

            <Button
                subtle
                size="sm"
                width={40}
                onClick={handleButtonClick}
                style={{ visibility: loading ? 'hidden' : 'visible' }}>
                <IconLib
                    icon={playing ? 'pause' : 'play'}
                    size="lg"
                />
            </Button>

            <div
                ref={ref}
                className="f-audio-waveform__container f-row"
                onClick={handleClick}
                style={{ height, visibility: loading ? 'hidden' : 'visible' }}>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={range}
                    onChange={handleRangeChange}
                    className="f-audio-waveform__range"
                />
                <svg
                    height={height}
                    xmlns="http://www.w3.org/2000/svg"
                    className="f-audio-waveform__active"
                    style={{ clipPath: `inset(0 ${100 - range}% 0 0)` }}>
                    {renderLine}
                </svg>
                <svg
                    height={height}
                    xmlns="http://www.w3.org/2000/svg"
                    className="f-audio-waveform__inactive">
                    {renderLine}
                </svg>
            </div>
        </View>
    )
}
