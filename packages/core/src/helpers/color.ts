export const getHSB = ({ r, g, b }) => {
    r /= 255
    g /= 255
    b /= 255

    const v = Math.max(r, g, b)
    const n = v - Math.min(r, g, b)
    const h = n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n

    return {
        h: 60 * (h < 0 ? h + 6 : h),
        s: v && (n / v) * 100,
        b: v * 100,
    }
}

export const hslToHex = ({ h, s, l }) => {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
}

export const hsbToRgb = ({ h, s, b }) => {
    s /= 100
    b /= 100
    const k = (n) => (n + h / 60) % 6
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
    return {
        r: 255 * f(5),
        g: 255 * f(3),
        b: 255 * f(1),
    }
}

export const getHSL = ({ r, g, b }) => {
    ;(r /= 255), (g /= 255), (b /= 255)
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b)
    var h,
        s,
        l = (max + min) / 2

    if (max == min) {
        h = s = 0 // achromatic
    } else {
        var d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    }
}

export const getRGB = (hex: string) => {
    const rgb = hex.substring(1).match(/.{1,2}/g)
    return {
        r: parseInt(rgb[0], 16),
        g: parseInt(rgb[1], 16),
        b: parseInt(rgb[2], 16),
    }
}

export const getForegroundColor = (defaultColor: string, threshold = 0.6) => {
    if (!defaultColor) return null
    const { r, g, b } = getRGB(defaultColor)
    const coef = (r * 0.299 + g * 0.587 + b * 0.114) / 255
    const lightRamp = Math.round(100 + 100 * (1 - coef))
    const darkRamp = Math.round(-100 - 50 * coef)
    return coef < threshold ? shadeColor(defaultColor, lightRamp) : shadeColor(defaultColor, darkRamp)
}

export const addAlpha = (color, opacity) => {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
    return color + _opacity.toString(16).toUpperCase()
}

export function shadeColor(col, amt) {
    col = col.replace(/^#/, '')
    if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2]

    let [r, g, b] = col.match(/.{2}/g)
    ;[r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt]

    r = Math.max(Math.min(255, r), 0).toString(16)
    g = Math.max(Math.min(255, g), 0).toString(16)
    b = Math.max(Math.min(255, b), 0).toString(16)

    const rr = (r.length < 2 ? '0' : '') + r
    const gg = (g.length < 2 ? '0' : '') + g
    const bb = (b.length < 2 ? '0' : '') + b

    return `#${rr}${gg}${bb}`
}

export const lightenedHex = (hex, percent) => {
    hex = hex.replace(/^#/, '')

    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(function (hexDigit) {
                return hexDigit + hexDigit
            })
            .join('')
    }

    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)

    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

    let lightenedHex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()

    return lightenedHex
}
