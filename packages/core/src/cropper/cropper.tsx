import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, SpinnerOverlay, View } from '..'
import { classNames, getBoundingClientRect, rotate } from '../helpers'
import { useDragging } from '../hooks/dragging.hook'
import { useEvent } from '../hooks/event.hook'
import { useResize } from '../hooks/resize.hook'
import { IconLib } from '../icon'
import { Range } from '../range/range'
import { CoreViewProps } from '../types'

export type CropperProps = {
    defaultRotation?: number
    defaultZoom?: number
    rotationIncrement?: number
    zoomIncrement?: number
    zoomMax?: number
    customToolbar?: any
    src: string
    onSave?: (png: string) => void
} & CoreViewProps

export const Cropper = (props: CropperProps) => {
    const {
        defaultRotation = 0,
        defaultZoom = 1.5,
        rotationIncrement = 2.5,
        zoomIncrement = 0.1,
        zoomMax = 5,
        customToolbar,
        src,
        onSave,
        ...rest
    } = props
    const canvasRef = useRef(null)
    const [canvas, setCanvas] = useState<any>({})
    const dimensions = useResize(canvasRef.current)
    const imageCache = useRef(null)
    const imageDimensionsCache = useRef<any>({})
    const [rotation, setRotation] = useState(defaultRotation)
    const [zoom, setZoom] = useState(defaultZoom)
    const [error, setError] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const { dragging, startDragging, stopDragging } = useDragging()
    const bufferRef = useRef({ x: 0, y: 0 })
    const className = classNames(
        {
            'f-cropper': true,
            'f-col': true,
            'is-dragging': dragging,
        },
        [props.className]
    )

    const handleSave = () => onSave(canvasRef.current?.toDataURL('image/png'))

    const handleMouseUp = (e) => stopDragging()

    const handleMouseDown = (e) => {
        const angle = (Math.PI / 180) * rotation
        const { left, top } = getBoundingClientRect(canvasRef.current)
        const { clientX, clientY } = e
        const rClient = rotate(clientX, clientY, -angle)
        const localY = rClient.y - left
        const localX = rClient.x - top
        const image: any = imageDimensionsCache.current
        const bufferX = localX - image.left
        const bufferY = localY - image.top

        bufferRef.current = { x: bufferX, y: bufferY }

        startDragging()
    }

    const handleMouseMove = (e) => {
        if (!dragging) return

        const img = imageCache.current
        const ctx = canvasRef.current?.getContext('2d')
        const angle = (Math.PI / 180) * rotation
        const { left, top } = getBoundingClientRect(canvasRef.current)
        const { clientX, clientY } = e
        const rClient = rotate(clientX, clientY, -angle)
        const localY = rClient.y - left
        const localX = rClient.x - top
        const image: any = {
            ...imageDimensionsCache.current,
            left: localX - bufferRef.current.x,
            top: localY - bufferRef.current.y,
        }

        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(angle)
        ctx.drawImage(img, image.left, image.top, image.width, image.height)
        ctx.restore()

        imageDimensionsCache.current = image
    }

    const handleRotateRightClick = (e) => setRotation(rotation + rotationIncrement)

    const handleRotateLeftClick = (e) => setRotation(rotation - rotationIncrement)

    const handleRangeChange = (e) => setZoom(Number(e.target.value))

    const handlePlusClick = (e) => setZoom(zoom + zoomIncrement <= zoomMax ? zoom + zoomIncrement : zoomMax)

    const handleMinusClick = (e) => setZoom(zoom - zoomIncrement >= 0 ? zoom - zoomIncrement : 0)

    useEvent('mousemove', handleMouseMove)
    useEvent('mouseup', handleMouseUp)

    useEffect(() => {
        if (!loaded) return

        const img = imageCache.current
        const ctx = canvasRef.current?.getContext('2d')
        const angle = (Math.PI / 180) * rotation
        const image: any = imageDimensionsCache.current
        const multipler = (canvas.width / img.width) * zoom
        const width = img.width * multipler
        const height = img.height * multipler
        const differenceWidth = image.width - width
        const differenceHeight = image.height - height
        const top = image.top + differenceHeight / 2
        const left = image.left + differenceWidth / 2
        const newImage = { top, left, width, height }

        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(angle)
        ctx.drawImage(img, newImage.left, newImage.top, newImage.width, newImage.height)
        ctx.restore()

        imageCache.current = img
        bufferRef.current = image
        imageDimensionsCache.current = newImage
    }, [zoom, rotation, loaded])

    useEffect(() => {
        if (canvas.width && canvas.height) {
            canvasRef.current.width = canvas.width
            canvasRef.current.height = canvas.height

            setError(false)

            const img = new Image()

            img.src = src
            img.setAttribute('crossorigin', 'anonymous')
            img.onload = () => {
                const ctx = canvasRef.current?.getContext('2d')
                const multipler = (canvas.width / img.width) * zoom
                const angle = (Math.PI / 180) * rotation
                const width = img.width * multipler
                const height = img.height * multipler
                const top = 0 - height / 2
                const left = 0 - width / 2
                const image: any = { width, height, left, top }

                ctx.save()
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.translate(canvas.width / 2, canvas.height / 2)
                ctx.rotate(angle)
                ctx.drawImage(img, left, top, image.width, image.height)
                ctx.restore()

                imageCache.current = img
                imageDimensionsCache.current = image
                bufferRef.current = image

                setLoaded(true)
                setError(false)
            }
            img.onerror = () => {
                setError(true)
            }
        }
    }, [canvas, src])

    useLayoutEffect(() => {
        setCanvas(getBoundingClientRect(canvasRef.current))
    }, [dimensions])

    return (
        <>
            <View
                {...rest}
                className={className}>
                <div className="f-cropper__canvas">
                    {!loaded && <SpinnerOverlay />}
                    {error && (
                        <span className="f-cropper__error f-col">
                            <IconLib
                                icon="warning"
                                size="xl"
                            />
                        </span>
                    )}

                    <div className="f-cropper__mask" />

                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                    />
                </div>

                {!customToolbar && (
                    <div className="f-cropper__tools f-row">
                        <Button
                            subtle
                            disabled={!loaded}
                            onClick={handleMinusClick}>
                            <IconLib icon="minus" />
                        </Button>
                        <Range
                            disabled={!loaded}
                            step={zoomIncrement}
                            min={0}
                            max={zoomMax}
                            value={zoom}
                            onChange={handleRangeChange}
                        />
                        <Button
                            subtle
                            disabled={!loaded}
                            onClick={handlePlusClick}>
                            <IconLib icon="plus" />
                        </Button>
                        <Button
                            subtle
                            disabled={!loaded}
                            onClick={handleRotateRightClick}>
                            <IconLib icon="rotate-right" />
                        </Button>
                        <Button
                            subtle
                            disabled={!loaded}
                            onClick={handleRotateLeftClick}>
                            <IconLib icon="rotate-left" />
                        </Button>
                        <Button
                            disabled={!loaded}
                            variant="accent"
                            onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                )}
            </View>

            {!!customToolbar
                ? customToolbar({
                      rotate: setRotation,
                      zoom: setZoom,
                      save: onSave,
                  })
                : null}
        </>
    )
}
