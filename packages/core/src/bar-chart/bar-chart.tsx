import React, { ReactNode, useMemo, useRef, useState } from 'react'
import { Flexer, Text, View } from '../'
import { classNames, formatChartNumber, getBoundingClientRect } from '../helpers'
import { useResize } from '../hooks'
import { CoreViewProps } from '../types'

export type BarChartValue = {
    label: string
    count: number
    metric?: string
}

export type BarChartGroup = {
    legend: string
    color: string
    values: BarChartValue[]
}

export type BarChartProps = {
    /**
     * One or more groups of bars. Bars are grouped by their shared `label`.
     */
    data: BarChartGroup[]
    /**
     * Optional title rendered above the chart.
     */
    title?: ReactNode
    /**
     * Optional content rendered to the right of the title (before the legends).
     */
    header?: ReactNode
    /**
     * Height of the plot area, in pixels.
     */
    height?: number
    /**
     * Render background gridlines.
     */
    grid?: boolean
    /**
     * Number of value (Y) ticks.
     */
    ticks?: number
    /**
     * Corner radius applied to the top of each bar.
     */
    radius?: number
} & CoreViewProps

const MARGIN = { top: 16, right: 16, bottom: 56, left: 44 }

export const BarChart = (props: BarChartProps) => {
    const { data = [], title, header, height = 300, grid = true, ticks = 5, radius = 3, ...rest } = props
    const ref = useRef(null)
    const dimensions = useResize(ref.current)
    const [box, setBox] = useState<any>({ width: 0, height: 0 })
    const [tip, setTip] = useState<{ x: number; y: number; label: string } | null>(null)

    const className = classNames(
        {
            'f-bar-chart': true,
        },
        [props.className]
    )

    const width = box.width
    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
    const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom)

    // Categories are the ordered, unique set of labels across every group.
    const labels = useMemo(() => {
        const seen: string[] = []
        data.forEach((group) => group.values.forEach((v) => !seen.includes(v.label) && seen.push(v.label)))
        return seen
    }, [data])

    const max = useMemo(() => {
        const counts = data.reduce<number[]>((acc, g) => [...acc, ...g.values.map((v) => v.count)], [])
        return Math.max(...counts, 0) || 1
    }, [data])

    const yTicks = useMemo(() => new Array(ticks).fill(null).map((_, i) => (max / (ticks - 1)) * i), [max, ticks])

    const band = labels.length ? innerWidth / labels.length : innerWidth
    const groupPadding = band * 0.2
    const barAreaWidth = band - groupPadding
    const barWidth = data.length ? barAreaWidth / data.length : barAreaWidth

    const yFor = (value: number) => MARGIN.top + innerHeight - (value / max) * innerHeight

    React.useEffect(() => setBox(getBoundingClientRect(ref.current)), [dimensions, height, data])

    return (
        <View
            {...rest}
            className={className}
            column
            width="100%"
            alignItems="stretch"
            gap={10}>
            {(title || header || data.length > 0) && (
                <View
                    row
                    width="100%"
                    gap={10}>
                    {title && <Text fontWeight="bold">{title}</Text>}
                    <Flexer />
                    {header}
                    <View
                        row
                        gap={15}
                        wrap="wrap"
                        className="f-bar-chart__legends">
                        {data.map((group, index) => (
                            <View
                                key={index}
                                row
                                gap={6}
                                className="f-bar-chart__legend">
                                <span
                                    className="f-bar-chart__swatch"
                                    style={{ background: group.color }}
                                />
                                <Text size="sm">{group.legend}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <View
                position="relative"
                width="100%"
                height={height}>
                <svg
                    ref={ref}
                    width="100%"
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    className="f-bar-chart__chart">
                    {/* gridlines + value labels */}
                    {width > 0 &&
                        yTicks.map((value, i) => {
                            const y = yFor(value)
                            return (
                                <g key={i}>
                                    {grid && (
                                        <line
                                            className="f-bar-chart__grid"
                                            x1={MARGIN.left}
                                            x2={width - MARGIN.right}
                                            y1={y}
                                            y2={y}
                                        />
                                    )}
                                    <text
                                        className="f-bar-chart__axis"
                                        x={MARGIN.left - 8}
                                        y={y}
                                        textAnchor="end"
                                        dominantBaseline="middle">
                                        {formatChartNumber(value)}
                                    </text>
                                </g>
                            )
                        })}

                    {/* bars */}
                    {width > 0 &&
                        labels.map((label, li) => {
                            const bandX = MARGIN.left + band * li + groupPadding / 2
                            return (
                                <g key={label}>
                                    {data.map((group, gi) => {
                                        const value = group.values.find((v) => v.label == label)
                                        if (!value) return null
                                        const barHeight = (value.count / max) * innerHeight
                                        const x = bandX + barWidth * gi
                                        const y = MARGIN.top + innerHeight - barHeight
                                        return (
                                            <rect
                                                key={gi}
                                                className="f-bar-chart__bar"
                                                x={x}
                                                y={y}
                                                width={Math.max(0, barWidth - 2)}
                                                height={barHeight}
                                                rx={radius}
                                                fill={group.color}
                                                onMouseEnter={() =>
                                                    setTip({
                                                        x: x + barWidth / 2,
                                                        y,
                                                        label: `${label} · ${formatChartNumber(value.count)}`,
                                                    })
                                                }
                                                onMouseLeave={() => setTip(null)}
                                            />
                                        )
                                    })}
                                    <text
                                        className="f-bar-chart__axis f-bar-chart__label"
                                        x={MARGIN.left + band * li + band / 2}
                                        y={MARGIN.top + innerHeight + 16}
                                        textAnchor="end"
                                        transform={`rotate(-35, ${MARGIN.left + band * li + band / 2}, ${
                                            MARGIN.top + innerHeight + 16
                                        })`}>
                                        {label.length > 16 ? `${label.slice(0, 15)}…` : label}
                                    </text>
                                </g>
                            )
                        })}
                </svg>

                {tip && (
                    <div
                        className="f-bar-chart__tooltip"
                        style={{ left: tip.x, top: tip.y - 12 }}>
                        {tip.label}
                    </div>
                )}
            </View>
        </View>
    )
}
