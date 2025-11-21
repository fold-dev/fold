import { CoreViewProps, Size, View, classNames, getKey, scrollToCenter, scrollToTop, useResize } from '../'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TimePickerTime } from './time-picker-time'

export type TimePickerColumnProps = {
    size?: Size
    pad?: boolean
    items: number[]
    selected: number
    onSelect: any
} & CoreViewProps

export const TimePickerColumn = (props: TimePickerColumnProps) => {
    const { size = 'md', items, selected, onSelect, style = {}, pad, ...rest } = props
    const ref = useRef(null)
    const dimensions = useResize(ref.current)
    const [buffer, setBuffer] = useState(0)
    const className = classNames({
        'f-time-picker-column': true,
        'f-scrollbar': true,
    })

    const handleKeyDown = (e) => {
        const { isUp, isDown, isEnter } = getKey(e)

        if (isUp || isDown || isEnter) {
            e.preventDefault()
            e.stopPropagation()

            const selectedIndex = items.findIndex((i) => i == selected)

            if (isUp) onSelect(selectedIndex == 0 ? items[items.length - 1] : items[selectedIndex - 1])
            if (isDown) onSelect(selectedIndex == items.length - 1 ? items[0] : items[selectedIndex + 1])
        }
    }

    useEffect(() => {
        const selectedIndex = items.findIndex((i) => i == selected)
        scrollToTop(ref.current.children[selectedIndex])
    }, [items, dimensions, selected])

    useLayoutEffect(() => {
        const { firstChild } = ref.current
        setBuffer(ref.current.offsetHeight - firstChild.offsetHeight)
    }, [items, dimensions])

    return (
        <View
            {...rest}
            ref={ref}
            tabIndex={0}
            style={{ ...style, paddingBottom: buffer }}
            className={className}
            onKeyDown={handleKeyDown}>
            {items.map((item, index) => {
                const i: number | any = pad ? (+item < 10 ? '0' + item : item) : item

                return (
                    <TimePickerTime
                        key={index}
                        value={i}
                        size={size}
                        selected={selected == item}
                        onSelect={() => onSelect(item)}
                    />
                )
            })}
        </View>
    )
}
