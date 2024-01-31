import { AriaAttributes, AriaRole, CSSProperties, DOMAttributes, Key, ReactNode } from 'react'

export type ListStyleType =
    | 'default'
    | 'none'
    | 'disc'
    | 'circle'
    | 'square'
    | 'decimal'
    | 'decimal-leading-zero'
    | 'lower-roman'
    | 'upper-roman'
    | 'lower-greek'
    | 'lower-latin'
    | 'upper-latin'
    | 'armenian'
    | 'georgian'
    | 'lower-alpha'
    | 'upper-alpha'
    | 'none'

export type LinkTarget = '_self' | '_blank' | '_parent' | '_top'

export type PopoutPosition =
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'middle-left'
    | 'middle-right'

export type Color =
    | 'electric'
    | 'gray'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'blue'
    | 'cyan'
    | 'purple'
    | 'pink'

export type Weight = 'hairline' | 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Align = 'left' | 'center' | 'right'

export type Variant = 'default' | 'accent' | 'success' | 'neutral' | 'caution' | 'warning' | 'danger' | 'highlight'

export type FlexAlign =
    | 'space-between'
    | 'space-around'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch'
    | 'auto'
    | 'baseline'

export type ViewAlign =
    | 'v-top-left'
    | 'v-top-center'
    | 'v-top-right'
    | 'v-left-stretch'
    | 'v-left-between'
    | 'v-middle-left'
    | 'v-middle-center'
    | 'v-middle-right'
    | 'v-center-stretch'
    | 'v-center-between'
    | 'v-bottom-left'
    | 'v-bottom-center'
    | 'v-bottom-right'
    | 'v-right-stretch'
    | 'v-right-between'
    | 'h-top-left'
    | 'h-top-center'
    | 'h-top-right'
    | 'h-top-stretch'
    | 'h-top-between'
    | 'h-middle-left'
    | 'h-middle-center'
    | 'h-middle-right'
    | 'h-middle-stretch'
    | 'h-middle-between'
    | 'h-bottom-left'
    | 'h-bottom-center'
    | 'h-bottom-right'
    | 'h-bottom-stretch'
    | 'h-bottom-between'

export type AriaProps = AriaAttributes

export type CoreViewProps = AriaAttributes & CommonProps & ShorthandProps & DOMAttributes<any>

export type FormEvents = DOMAttributes<any>

export type ShorthandProps = {
    /**
     * CSS hex color value
     */
    bg?: string
    /**
     * CSS color token without the "--f-color-" prefix
     */
    bgToken?: string
    /**
     * CSS hex color value
     */
    color?: string
    /**
     * CSS color token without the "--f-color-" prefix
     */
    colorToken?: string
    /**
     * CSS width
     */
    width?: string | number
    /**
     * CSS height
     */
    height?: string | number
    /**
     * CSS position
     */
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static'
    /**
     * CSS display
     */
    display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'
    /**
     * CSS padding
     */
    p?: string | number
    /**
     * CSS margin
     */
    m?: string | number
    /**
     * CSS z-index
     */
    zIndex?: string | number
    /**
     * CSS radius
     */
    radius?: string | number
    /**
     * CSS blur
     */
    blur?: string | number
    /**
     * CSS letter-spacing
     */
    letterSpacing?: string | number
    /**
     * CSS line-height
     */
    lineHeight?: string | number
    /**
     * CSS font-weight
     */
    fontWeight?: string | number
    /**
     * CSS font-family
     */
    font?: string
    /**
     * CSS font-size
     */
    fontSize?: string | number
    /**
     * CSS text-decoration
     */
    textDecoration?: 'none' | 'underline' | 'overline' | 'line-through' | 'underline' | string
    /**
     * CSS text-align
     */
    textAlign?: string
    /**
     * CSS box-shadow
     */
    shadow?: string | number
    /**
     * CSS border
     */
    border?: string | number
    /**
     * CSS transition
     */
    transition?: string | number
    /**
     * add .f-row CSS class
     */
    row?: boolean
    /**
     * add .f-col CSS class
     */
    column?: boolean
    /**
     * CSS align-content
     */
    alignContent?: FlexAlign
    /**
     * CSS align-items
     */
    alignItems?: FlexAlign
    /**
     * CSS flex-basis
     */
    basis?: string
    /**
     * CSS flex-direction
     */
    flexDirection?: 'row ' | 'row-reverse' | 'column' | 'column-reverse'
    /**
     * CSS flex-grow
     */
    grow?: string | number
    /**
     * CSS flex-shrink
     */
    shrink?: string | number
    /**
     * CSS justify-content
     */
    justifyContent?: FlexAlign
    /**
     * CSS flex-wrap
     */
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    /**
     * CSS flex
     */
    flex?: number | string
    /**
     * CSS flow layout
     */
    flow?: string
    /**
     * CSS flex alignment
     */
    alignSelf?: FlexAlign
    /**
     * please see typedoc for align classes
     */
    align?: ViewAlign
    /**
     * CSS flex gap
     */
    gap?: number | string
}

export type CommonProps = {
    key?: Key | undefined
    children?: ReactNode[] | ReactNode | undefined
    id?: string | undefined
    tabIndex?: number
    disabled?: boolean
    role?: AriaRole | undefined
    style?: CSSProperties | undefined | any
    className?: string | undefined
}
