import React, { useEffect, useRef, useState } from 'react'
import { Button, SpinnerOverlay, View } from '..'
import { classNames, getBoundingClientRect, rotate } from '../helpers'
import { useDragging } from '../hooks/dragging.hook'
import { useEvent } from '../hooks/event.hook'
import { useResize } from '../hooks/resize.hook'
import { IconLib } from '../icon'
import { Range } from '../range/range'
import { CoreViewProps } from '../types'

export type CropperProps = {
    aspectRatio?: number
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
        aspectRatio,
        defaultRotation = 0,
        defaultZoom = 1.5,
        rotationIncrement = 90,
        zoomIncrement = 0.1,
        zoomMax = 5,
        customToolbar,
        src,
        onSave,
        ...rest
    } = props
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvasContainer, setCanvasContainer] = useState<HTMLElement>(null)
    const canvas = useResize(canvasContainer)
    const imageCache = useRef<HTMLImageElement>(null)
    const imageDimensionsCache = useRef<any>({})
    const imageRotationCache = useRef((Math.PI / 180) * defaultRotation)
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

    const getCropRect = () => {
        const maxWidth = canvas.width * 0.9
        const maxHeight = canvas.height * 0.9
        const width = aspectRatio ? Math.min(maxWidth, maxHeight * aspectRatio) : maxWidth
        const height = aspectRatio ? width / aspectRatio : maxHeight

        return {
            left: (canvas.width - width) / 2,
            top: (canvas.height - height) / 2,
            width,
            height,
        }
    }

    const constrainImage = (image, angle) => {
        const crop = getCropRect()
        const corners = [
            { x: -crop.width / 2, y: -crop.height / 2 },
            { x: crop.width / 2, y: -crop.height / 2 },
            { x: crop.width / 2, y: crop.height / 2 },
            { x: -crop.width / 2, y: crop.height / 2 },
        ].map(({ x, y }) => rotate(x, y, -angle))
        const center = { x: image.left + image.width / 2, y: image.top + image.height / 2 }
        const minX = Math.max(...corners.map(({ x }) => x - image.width / 2))
        const maxX = Math.min(...corners.map(({ x }) => x + image.width / 2))
        const minY = Math.max(...corners.map(({ y }) => y - image.height / 2))
        const maxY = Math.min(...corners.map(({ y }) => y + image.height / 2))
        const constrainedCenter = {
            x: Math.min(Math.max(center.x, minX), maxX),
            y: Math.min(Math.max(center.y, minY), maxY),
        }

        return {
            ...image,
            left: constrainedCenter.x - image.width / 2,
            top: constrainedCenter.y - image.height / 2,
        }
    }

    const getImageDimensions = (img, angle, nextZoom, previousImage: any = {}) => {
        const crop = getCropRect()
        const corners = [
            { x: -crop.width / 2, y: -crop.height / 2 },
            { x: crop.width / 2, y: -crop.height / 2 },
            { x: crop.width / 2, y: crop.height / 2 },
            { x: -crop.width / 2, y: crop.height / 2 },
        ].map(({ x, y }) => rotate(x, y, -angle))
        const cropWidth = Math.max(...corners.map(({ x }) => x)) - Math.min(...corners.map(({ x }) => x))
        const cropHeight = Math.max(...corners.map(({ y }) => y)) - Math.min(...corners.map(({ y }) => y))
        const multiplier = Math.max(cropWidth / img.width, cropHeight / img.height) * nextZoom
        const width = img.width * multiplier
        const height = img.height * multiplier
        let center = { x: 0, y: 0 }

        if (previousImage.left != null) {
            const previousCenter = {
                x: previousImage.left + previousImage.width / 2,
                y: previousImage.top + previousImage.height / 2,
            }
            const screenCenter = rotate(previousCenter.x, previousCenter.y, imageRotationCache.current)
            center = rotate(screenCenter.x, screenCenter.y, -angle)
        }

        return constrainImage(
            {
                left: center.x - width / 2,
                top: center.y - height / 2,
                width,
                height,
            },
            angle
        )
    }

    const drawImage = (image, angle) => {
        const img = imageCache.current
        const ctx = canvasRef.current?.getContext('2d')
        if (!img || !ctx) return

        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(angle)
        ctx.drawImage(img, image.left, image.top, image.width, image.height)
        ctx.restore()

        imageDimensionsCache.current = image
        imageRotationCache.current = angle
    }

    const handleSave = () => {
        if (!onSave || !canvasRef.current) return

        const crop = getCropRect()
        const output = document.createElement('canvas')
        output.width = Math.round(crop.width)
        output.height = Math.round(crop.height)
        output
            .getContext('2d')
            ?.drawImage(
                canvasRef.current,
                crop.left,
                crop.top,
                crop.width,
                crop.height,
                0,
                0,
                output.width,
                output.height
            )
        onSave(output.toDataURL('image/png'))
    }

    const handlePointerUp = () => stopDragging()

    const handlePointerDown = (e) => {
        if (!loaded) return

        const angle = (Math.PI / 180) * rotation
        const { left, top } = getBoundingClientRect(canvasRef.current)
        const point = rotate(e.clientX - left - canvas.width / 2, e.clientY - top - canvas.height / 2, -angle)
        const image: any = imageDimensionsCache.current

        bufferRef.current = { x: point.x - image.left, y: point.y - image.top }
        startDragging()
    }

    const handlePointerMove = (e) => {
        if (!dragging) return

        const angle = (Math.PI / 180) * rotation
        const { left, top } = getBoundingClientRect(canvasRef.current)
        const point = rotate(e.clientX - left - canvas.width / 2, e.clientY - top - canvas.height / 2, -angle)
        const image: any = constrainImage(
            {
                ...imageDimensionsCache.current,
                left: point.x - bufferRef.current.x,
                top: point.y - bufferRef.current.y,
            },
            angle
        )

        drawImage(image, angle)
    }

    const handleRotateRightClick = () => setRotation(rotation + rotationIncrement)

    const handleRotateLeftClick = () => setRotation(rotation - rotationIncrement)

    const handleRangeChange = (e) => setZoom(Number(e.target.value))

    const handlePlusClick = () => setZoom(zoom + zoomIncrement <= zoomMax ? zoom + zoomIncrement : zoomMax)

    const handleMinusClick = () => setZoom(zoom - zoomIncrement >= 1 ? zoom - zoomIncrement : 1)

    useEvent('pointermove', handlePointerMove)
    useEvent('pointerup', handlePointerUp)
    useEvent('pointercancel', handlePointerUp)

    useEffect(() => {
        if (!loaded) return

        const angle = (Math.PI / 180) * rotation
        const image = getImageDimensions(imageCache.current, angle, zoom, imageDimensionsCache.current)
        drawImage(image, angle)
    }, [zoom, rotation, loaded])

    useEffect(() => {
        if (!canvas.width || !canvas.height || !src) return

        canvasRef.current.width = canvas.width
        canvasRef.current.height = canvas.height
        setLoaded(false)
        setError(false)
        setRotation(defaultRotation)
        setZoom(defaultZoom)

        const img = new Image()
        img.setAttribute('crossorigin', 'anonymous')
        img.src = src
        img.onload = () => {
            imageCache.current = img
            const angle = (Math.PI / 180) * defaultRotation
            const image = getImageDimensions(img, angle, defaultZoom)
            drawImage(image, angle)
            setLoaded(true)
        }
        img.onerror = () => setError(true)
    }, [canvas, src])

    const crop = canvas.width && canvas.height ? getCropRect() : null

    return (
        <>
            <View
                {...rest}
                className={className}>
                <div
                    ref={setCanvasContainer}
                    className="f-cropper__canvas">
                    {!loaded && !error && <SpinnerOverlay />}
                    {error && (
                        <span className="f-cropper__error f-col">
                            <IconLib
                                icon="warning"
                                size="xl"
                            />
                        </span>
                    )}

                    <div
                        className="f-cropper__mask"
                        style={crop ? { width: crop.width, height: crop.height } : undefined}
                    />

                    <canvas
                        ref={canvasRef}
                        onPointerDown={handlePointerDown}
                    />
                </div>

                {!customToolbar && (
                    <div className="f-cropper__tools f-row">
                        <Button
                            subtle
                            disabled={!loaded || zoom <= 1}
                            onClick={handleMinusClick}>
                            <IconLib icon="minus" />
                        </Button>
                        <Range
                            disabled={!loaded}
                            step={zoomIncrement}
                            min={1}
                            max={zoomMax}
                            value={zoom}
                            onChange={handleRangeChange}
                        />
                        <Button
                            subtle
                            disabled={!loaded || zoom >= zoomMax}
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
                      save: handleSave,
                  })
                : null}
        </>
    )
}
