import React, { ReactElement, useLayoutEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, Input, IconButton, Range, useDragging, useEvent, useWindowEvent, View } from '..'
import { classNames, executeLast, getBoundingClientRect, getHSB, getHSL, getRGB, hsbToRgb, hslToHex } from '../helpers'
import { CommonProps, CoreViewProps } from '../types'
import { FICircle, FIEyeDropper } from '../icon'

export type PaletteProps = {
    color: string
    colors: string[]
    onChange?: (color: string) => void
} & Omit<CoreViewProps, 'onChange'>

export const Palette = (props: PaletteProps) => {
    const { onChange, color, colors, ...rest } = props
    const className = classNames(
        {
            'f-color-palette': true,
            'f-row': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}>
            {colors.map((c: string, index: number) => (
                <span
                    key={index}
                    style={{
                        backgroundColor: c,
                        borderColor: c,
                    }}
                    onClick={() => onChange(c)}
                    className={classNames({
                        'f-buttonize': true,
                        'f-color-palette__color': true,
                        'is-current': color == c,
                    })}
                />
            ))}
        </View>
    )
}

export type ColorPickerProps = {
    color: string
    onChange?: any
    footer?: ReactElement
} & Omit<CoreViewProps, 'onChange'>

export const ColorPicker = (props: ColorPickerProps) => {
    const { color, onChange, footer, ...rest } = props
    const { dragging, startDragging, stopDragging } = useDragging()
    const colorRef = useRef(null)
    const hasEyeDropperSupport = 'EyeDropper' in window
    const [backgroundColor, setBackgroundColor] = useState('')
    const [handle, setHandle] = useState({ top: 0, left: 0 })
    const mousePosition = useRef({ x: 0, y: 0 })
    const [range, setRange] = useState(0)
    const [type, setType] = useState<'hex' | 'rgb' | 'hsl'>('hex')
    const [hsl, setHsl] = useState<any>({ h: 0, s: 0, l: 0 })
    const [rgb, setRgb] = useState<any>({ r: 0, g: 0, b: 0 })
    const [hex, setHex] = useState<string>(color)
    const className = classNames(
        {
            'f-color-picker': true,
        },
        [props.className]
    )

    const updateHandle = (hsl, hsb) => {
        const dimensions = getBoundingClientRect(colorRef.current)
        const left = (hsl.s / 100) * dimensions.width
        const top = ((100 - hsb.b) / 100) * dimensions.height

        setHandle({ top, left })
    }

    const handleWindowMouseMove = (e) => {
        const { clientX, clientY } = e
        mousePosition.current = { x: clientX, y: clientY }
    }

    const handleMouseUp = (e) => {
        stopDragging()
    }

    const handleMouseDown = (e) => {
        startDragging()
    }

    const handleEyeDropper = async (e) => {
        stopDragging()

        try {
            const eyeDropper = new window['EyeDropper']()
            const result = await eyeDropper.open()
            const hex = result.sRGBHex
            const rgb = getRGB(hex)
            const hsl = getHSL(rgb)
            const hsb = getHSB(rgb)

            setHex(hex)
            setRgb(rgb)
            setHsl(hsl)

            setRange(hsl.h)

            onChange(hex)

            executeLast(() => {
                const dimensions = getBoundingClientRect(colorRef.current)
                const { top, left, right, bottom, width, height } = dimensions
                const { x, y } = mousePosition.current
                const mouseIsOnCanvas = x >= left && x <= right && y >= top && y <= bottom

                if (mouseIsOnCanvas) {
                    setHandle({
                        left: x - left,
                        top: y - top,
                    })
                } else {
                    setHandle({
                        left: (hsl.s / 100) * width,
                        top: ((100 - hsb.b) / 100) * height,
                    })
                }
            })
        } catch (e) {
            throw e
        }
    }

    const handleMouseMove = (e) => {
        if (!dragging) return

        const dimensions = getBoundingClientRect(colorRef.current)
        const { top, left, width, height } = dimensions
        const x = e.clientX - left
        const y = e.clientY - top

        if (x >= 0 && y >= 0 && x <= width && y <= height) {
            setHandle({ top: y, left: x })

            const h = hsl.h
            const s = (x / width) * 100
            const b = ((height - y) / height) * 100
            const hsb = { h, s, b }

            const newRgb = hsbToRgb(hsb)
            const newHsl = getHSL(rgb)
            const newHex = hslToHex(hsl)

            setRgb(newRgb)
            setHsl(newHsl)
            setHex(newHex)

            setRange(h)

            onChange(hex)
        }
    }

    const handleRangeChange = (e) => {
        const hue = Number(e.target.value)
        const newHsl = { ...hsl, h: hue }
        const newHex = hslToHex(newHsl)
        const newRgb = getRGB(newHex)

        // We don't need to change the handle
        // because lightness doesn't change
        setRange(hue)

        setHsl(newHsl)
        setHex(newHex)
        setRgb(newRgb)

        onChange(hex)
    }

    useLayoutEffect(() => {
        setBackgroundColor(hslToHex({ h: hsl.h, s: 100, l: 50 }))
    }, [hsl])

    useLayoutEffect(() => {
        const hex = color
        const rgb = getRGB(color)
        const hsb = getHSB(rgb)
        const hsl = getHSL(rgb)

        setRgb(rgb)
        setHsl(hsl)
        setHex(hex)

        const dimensions = getBoundingClientRect(colorRef.current)
        const left = (hsl.s / 100) * dimensions.width
        const top = ((100 - hsb.b) / 100) * dimensions.height

        setHandle({ top, left })
        setRange(hsb.h)
    }, [])

    useEvent('mouseup', handleMouseUp)

    useWindowEvent('mousemove', handleWindowMouseMove)

    const renderInputFields = () => {
        const handleHexUpdate = (hex) => {
            const rgb = getRGB(hex)
            const hsl = getHSL(rgb)
            const hsb = getHSB(rgb)

            setHex(hex)
            setRgb(rgb)
            setHsl(hsl)

            setRange(hsl.h)

            updateHandle(hsl, hsb)
        }

        const handleHslUpdate = (val, key) => {
            let mhsl = { ...hsl }
            mhsl[key] = Number(val)
            const hex = hslToHex(mhsl)
            const rgb = getRGB(hex)
            const hsb = getHSB(rgb)

            setHsl(mhsl)
            setHex(hex)
            setRgb(rgb)

            setRange(hsl.h)

            updateHandle(hsl, hsb)
        }

        const handleRgbUpdate = (val, key) => {
            let mrgb = { ...rgb }
            mrgb[key] = Number(val)
            const hsl = getHSL(mrgb)
            const hex = hslToHex(hsl)
            const hsb = getHSB(mrgb)

            setRgb(mrgb)
            setHsl(hsl)
            setHex(hex)

            setRange(hsl.h)

            updateHandle(hsl, hsb)
        }

        const handleFocus = (e) => e.currentTarget.select()

        return (
            <>
                {type == 'hex' && (
                    <Input
                        prefix="#"
                        type="text"
                        value={hex}
                        autoComplete="no"
                        spellCheck={false}
                        onFocus={handleFocus}
                        onChange={(e) =>
                            e.target.value.includes('#')
                                ? handleHexUpdate(e.target.value)
                                : handleHexUpdate('#' + e.target.value)
                        }
                    />
                )}

                {type == 'rgb' && (
                    <>
                        <Input
                            onFocus={handleFocus}
                            onChange={(e) => handleRgbUpdate(e.target.value, 'r')}
                            type="number"
                            value={Math.round(rgb.r)}
                            autoComplete="no"
                            spellCheck={false}
                        />
                        <Input
                            onFocus={handleFocus}
                            onChange={(e) => handleRgbUpdate(e.target.value, 'g')}
                            type="number"
                            value={Math.round(rgb.g)}
                            autoComplete="no"
                            spellCheck={false}
                        />
                        <Input
                            onFocus={handleFocus}
                            onChange={(e) => handleRgbUpdate(e.target.value, 'b')}
                            type="number"
                            value={Math.round(rgb.b)}
                            autoComplete="no"
                            spellCheck={false}
                        />
                    </>
                )}

                {type == 'hsl' && (
                    <>
                        <Input
                            onFocus={handleFocus}
                            onChange={(e) => handleHslUpdate(e.target.value, 'h')}
                            type="number"
                            value={Math.round(hsl.h)}
                            autoComplete="no"
                            spellCheck={false}
                        />
                        <Input
                            onFocus={handleFocus}
                            onChange={(e) => handleHslUpdate(e.target.value, 's')}
                            type="number"
                            value={Math.round(hsl.s)}
                            autoComplete="no"
                            spellCheck={false}
                        />
                        <Input
                            onFocus={handleFocus}
                            onChange={(e) => handleHslUpdate(e.target.value, 'l')}
                            type="number"
                            value={Math.round(hsl.l)}
                            autoComplete="no"
                            spellCheck={false}
                        />
                    </>
                )}
            </>
        )
    }

    return (
        <View
            {...rest}
            className={className}>
            <div
                ref={colorRef}
                className="f-color-picker__chooser"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onFocus={(e: any) => null}
                style={{ backgroundColor }}>
                <div
                    className="f-color-picker__handle"
                    style={{
                        top: handle.top,
                        left: handle.left,
                    }}
                />
            </div>

            <div className="f-color-picker__tools f-row">
                {hasEyeDropperSupport && (
                    <IconButton
                        p={10}
                        subtle
                        icon="eye-dropper"
                        onClick={handleEyeDropper}
                    />
                )}
                <div
                    className="f-color-picker__tools-color"
                    style={{ backgroundColor: hex }}
                />
                <Range
                    min={0}
                    max={360}
                    step={1}
                    value={range}
                    onChange={handleRangeChange}
                    className="f-color-picker__hue"
                />
            </div>

            <div className="f-color-picker__tools f-row">{renderInputFields()}</div>

            <div className="f-color-picker__tools f-row">
                <ButtonGroup
                    flex={1}
                    justifyContent="stretch">
                    <Button
                        onClick={() => setType('hex')}
                        active={type == 'hex'}>
                        Hex
                    </Button>
                    <Button
                        onClick={() => setType('rgb')}
                        active={type == 'rgb'}>
                        RGB
                    </Button>
                    <Button
                        onClick={() => setType('hsl')}
                        active={type == 'hsl'}>
                        HSL
                    </Button>
                </ButtonGroup>
            </div>

            {footer}
        </View>
    )
}
