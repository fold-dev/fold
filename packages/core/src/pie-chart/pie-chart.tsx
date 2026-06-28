import React, { ReactNode, useState } from 'react'
import { Text, View } from '../'
import { classNames, formatChartNumber, polarToCartesian } from '../helpers'
import { CoreViewProps } from '../types'

export type PieChartSlice = {
    legend: string
    color: string
    value: number
}

export type PieChartProps = {
    /**
     * The slices to render. Values are summed to determine each slice's angle.
     */
    data: PieChartSlice[]
    /**
     * Diameter of the chart, in pixels.
     */
    radius?: number
    /**
     * Inner radius, in pixels. A value greater than 0 renders a donut.
     */
    innerRadius?: number
    /**
     * Optional title rendered above the chart.
     */
    title?: ReactNode
    /**
     * Render the legend beside the chart.
     */
    showLegend?: boolean
} & CoreViewProps

const arcPath = (cx: number, cy: number, outer: number, inner: number, start: number, end: number) => {
    const largeArc = end - start > Math.PI ? 1 : 0
    const o0 = polarToCartesian(cx, cy, outer, start)
    const o1 = polarToCartesian(cx, cy, outer, end)

    if (inner <= 0) {
        return `M ${cx} ${cy} L ${o0.x} ${o0.y} A ${outer} ${outer} 0 ${largeArc} 1 ${o1.x} ${o1.y} Z`
    }

    const i0 = polarToCartesian(cx, cy, inner, end)
    const i1 = polarToCartesian(cx, cy, inner, start)
    return (
        `M ${o0.x} ${o0.y} ` +
        `A ${outer} ${outer} 0 ${largeArc} 1 ${o1.x} ${o1.y} ` +
        `L ${i0.x} ${i0.y} ` +
        `A ${inner} ${inner} 0 ${largeArc} 0 ${i1.x} ${i1.y} Z`
    )
}

export const PieChart = (props: PieChartProps) => {
    const { data = [], radius = 120, innerRadius = 0, title, showLegend = true, ...rest } = props
    const [active, setActive] = useState<number | null>(null)

    const className = classNames(
        {
            'f-pie-chart': true,
        },
        [props.className]
    )

    const size = radius
    const cx = size / 2
    const cy = size / 2
    const outer = size / 2
    const total = data.reduce((sum, slice) => sum + slice.value, 0) || 1

    let cursor = 0
    const slices = data.map((slice, index) => {
        const start = (cursor / total) * Math.PI * 2
        cursor += slice.value
        const end = (cursor / total) * Math.PI * 2
        return { ...slice, index, start, end, percent: (slice.value / total) * 100 }
    })

    return (
        <View
            {...rest}
            className={className}
            row
            gap={20}
            wrap="wrap"
            alignItems="center">
            <View
                column
                gap={10}
                alignItems="flex-start">
                {title && <Text fontWeight="bold">{title}</Text>}
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="f-pie-chart__chart">
                    {slices.map((slice) => (
                        <path
                            key={slice.index}
                            className="f-pie-chart__slice"
                            d={arcPath(cx, cy, outer, innerRadius, slice.start, slice.end)}
                            fill={slice.color}
                            style={{ opacity: active == null || active == slice.index ? 1 : 0.4 }}
                            onMouseEnter={() => setActive(slice.index)}
                            onMouseLeave={() => setActive(null)}
                        />
                    ))}
                </svg>
            </View>

            {showLegend && (
                <View
                    column
                    gap={8}
                    alignItems="flex-start"
                    className="f-pie-chart__legends">
                    {slices.map((slice) => (
                        <View
                            key={slice.index}
                            row
                            gap={8}
                            className="f-pie-chart__legend"
                            onMouseEnter={() => setActive(slice.index)}
                            onMouseLeave={() => setActive(null)}
                            style={{ opacity: active == null || active == slice.index ? 1 : 0.4 }}>
                            <span
                                className="f-pie-chart__swatch"
                                style={{ background: slice.color }}
                            />
                            <Text size="sm">{slice.legend}</Text>
                            <Text
                                size="sm"
                                colorToken="text-weaker">
                                {formatChartNumber(slice.value)} · {Math.round(slice.percent)}%
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}
