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
    bg?: string
    bgToken?: string
    color?: string
    colorToken?: string
    width?: string | number
    height?: string | number
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static'
    display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'
    p?: string | number
    m?: string | number
    zIndex?: string | number
    radius?: string | number
    blur?: string | number
    letterSpacing?: string | number
    lineHeight?: string | number
    fontWeight?: string | number
    font?: string
    fontSize?: string | number
    textDecoration?: 'none' | 'underline' | 'overline' | 'line-through' | 'underline' | string
    textAlign?: string
    shadow?: string | number
    border?: string | number
    transition?: string | number
    center?: boolean
    row?: boolean
    column?: boolean
    alignContent?: FlexAlign
    alignItems?: FlexAlign
    basis?: string
    flexDirection?: 'row ' | 'row-reverse' | 'column' | 'column-reverse'
    grow?: string | number
    shrink?: string | number
    justifyContent?: FlexAlign
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    flex?: number | string
    flow?: string
    alignSelf?: FlexAlign
    align?: ViewAlign
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
