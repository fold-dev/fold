import { CoreViewProps } from '../types'
import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react'
import { View } from '..'

export type VirtualProps = {
    numItems: number
    watch?: any[]
    itemHeight?: number
    maxHeight?: number
    render: any
} & CoreViewProps

export const Virtual = (props: any) => {
    const { numItems, watch, itemHeight = 35, maxHeight = 300, render, className = '', ...rest } = props
    const scrollRef = useRef(null)
    const [scrollTop, setScrollTop] = useState(0)
    const innerHeight = numItems * itemHeight
    const height = innerHeight < maxHeight ? innerHeight : maxHeight
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(numItems - 1, Math.floor((scrollTop + height) / itemHeight))
    const items: any = useMemo(() => {
        const items: any = []

        for (let index = startIndex; index <= endIndex; index++) {
            items.push(
                render({
                    index,
                    style: {
                        top: `${index * itemHeight}px`,
                        height: `${itemHeight}px`,
                        position: 'absolute',
                    },
                })
            )
        }

        return items
    }, [startIndex, endIndex, numItems, watch])

    return (
        <View
            {...rest}
            height={height}
            ref={scrollRef}
            className={'f-virtual ' + className}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
            {items}
            <div
                className="f-virtual__spacer"
                style={{ height: `${innerHeight}px` }}></div>
        </View>
    )
}

export const VirtualExperimental = (props: any) => {
    const { numItems, watch, itemHeight, render, maxHeight = 400, width = '100%', loadPrevious, loadNext } = props
    const changeRef = useRef(null)
    const scrollRef = useRef(null)
    const [scrollTop, setScrollTop] = useState(0)
    const innerHeight = numItems * itemHeight
    const height = innerHeight < maxHeight ? innerHeight : maxHeight
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(numItems - 1, Math.floor((scrollTop + height) / itemHeight))

    // watch is only here to that the
    // render function stays in sync with the parent state
    const items: any = useMemo(() => {
        const e: any = []

        for (let index = startIndex; index <= endIndex; index++) {
            const top = index * itemHeight

            e.push(
                render({
                    index,
                    style: {
                        position: 'absolute',
                        top: `${top}px`,
                        height: `${itemHeight}px`,
                    },
                })
            )
        }
        return e
    }, [startIndex, endIndex, numItems, watch])

    const handleScroll = (e) => {
        setScrollTop(e.currentTarget.scrollTop)
        if (!loadNext || !loadPrevious) return
        const offsetHeight = e.currentTarget.scrollHeight - e.currentTarget.scrollTop
        if (e.currentTarget.offsetHeight >= offsetHeight) loadNext()
        if (e.currentTarget.scrollTop <= 0) {
            loadPrevious()
            scrollRef.current.scrollTo({ top: itemHeight * 5 })
        }
    }

    useLayoutEffect(() => {
        if (!loadNext || !loadPrevious) return
        const windowItems = Math.floor(height / itemHeight)
        const startItem = windowItems / 2
        scrollRef.current.scrollTo({ top: itemHeight * startItem })
    }, [])

    // If the number of items change, then scroll to the top
    // Used when filtering
    useLayoutEffect(() => {
        const top = loadPrevious ? height / 2 : 0
        if (numItems != changeRef.current) scrollRef.current?.scrollTo({ top })
        changeRef.current = numItems
    }, [scrollRef.current, numItems])

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ height, width }}
            className="f-virtual f-scrollbar">
            <div style={{ height: `${innerHeight}px` }}>{items}</div>
        </div>
    )
}
