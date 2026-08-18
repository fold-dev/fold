/**
 * Compact number formatting shared by the chart components (e.g. 1500 -> "1.5k").
 * Kept dependency-free to match the rest of core.
 */
export const formatChartNumber = (value: number): string => {
    if (value == null || isNaN(value)) return ''

    const abs = Math.abs(value)
    const round = (n: number) => {
        const fixed = n.toFixed(1)
        return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed
    }

    if (abs >= 1e9) return `${round(value / 1e9)}b`
    if (abs >= 1e6) return `${round(value / 1e6)}m`
    if (abs >= 1e3) return `${round(value / 1e3)}k`
    if (Number.isInteger(value)) return String(value)

    return String(Math.round(value * 100) / 100)
}

/**
 * Convert a polar coordinate (angle in radians, measured clockwise from 12 o'clock)
 * into a cartesian point relative to a center. Used by the pie/donut chart.
 */
export const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
    return {
        x: cx + radius * Math.cos(angle - Math.PI / 2),
        y: cy + radius * Math.sin(angle - Math.PI / 2),
    }
}
