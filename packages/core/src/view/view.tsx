import React, {
    AllHTMLAttributes,
    createElement,
    forwardRef,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { useTheme } from '..'
import { classNames, cleanObject, getAlignClass, getOffset, mergeRefs } from '../helpers'
import { CommonProps, CoreViewProps, ShorthandProps } from '../types'

export type ScrollViewProps = {
    stickToTop?: boolean
    stickToBottom?: boolean
    onScrollToBottom?: any
    onScrollToTop?: any
} & CoreViewProps

export const ScrollView = forwardRef((props: ScrollViewProps, ref) => {
    const { stickToTop, stickToBottom, onScrollToBottom, onScrollToTop, style = {}, ...rest } = props
    const scrollRef = useRef(null)
    const [manually, setManually] = useState(false)
    let marginTop = 0

    const scrollToTop = () => {
        // If the user is scrolling
        if (manually) return

        // If there is no scroll ref
        if (!scrollRef.current) return

        // Move it right up
        scrollRef.current.scrollTop = 0
    }

    const scrollToBottom = () => {
        // If the user is scrolling
        if (manually) return

        // If there is no scroll ref
        if (!scrollRef.current) return

        // Move it right down
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }

    const handleScrollEvent = (e: any) => {
        const offsetHeight = scrollRef.current.scrollHeight - scrollRef.current.scrollTop
        const isBottom = scrollRef.current.offsetHeight >= offsetHeight
        const isTop = scrollRef.current.scrollTop == 0

        // If the user scrolls to the bottom or top
        if (isBottom && onScrollToBottom) onScrollToBottom()
        if (isTop && onScrollToTop) onScrollToTop()

        // If it's the bottom/top & it's sticky then set this
        if (isBottom && stickToBottom) setManually(false)
        if (isTop && stickToTop) setManually(false)

        // Otherwise let the user scroll
        if (!isBottom && !isTop) setManually(true)
    }

    useEffect(() => {
        if (stickToBottom) scrollToBottom()
        if (stickToTop) scrollToTop()
    }, [props.children])

    useEffect(() => {
        if (stickToBottom) scrollToBottom()
        if (stickToTop) scrollToTop()
    }, [])

    useLayoutEffect(() => {
        if (scrollRef.current) {
            const { lastChild } = scrollRef.current

            if (lastChild) {
                const { height } = lastChild.getBoundingClientRect()
                const scrollHeightOfContent = lastChild.offsetTop + height
                const { scrollHeight } = scrollRef.current

                if (!manually && stickToBottom && scrollHeightOfContent < scrollHeight) {
                    marginTop = scrollHeight - scrollHeightOfContent
                }
            }
        }
    })

    return (
        <View
            {...rest}
            style={{
                position: 'relative',
                top: 0,
                left: 0,
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
            }}>
            <div
                ref={mergeRefs([ref, scrollRef])}
                onScroll={handleScrollEvent}
                style={{
                    ...style,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    overflow: 'scroll',
                    marginTop,
                }}>
                {props.children}
            </div>
        </View>
    )
})

export type ViewProps = {
    as?: string
} & ShorthandProps &
    AllHTMLAttributes<any>

export const View = forwardRef((props: ViewProps, ref) => {
    const { getColorToken } = useTheme()
    const {
        as = 'div',
        bg,
        bgToken,
        color,
        colorToken,
        width,
        height,
        position,
        display,
        p,
        m,
        zIndex,
        radius,
        blur,
        letterSpacing,
        lineHeight,
        fontWeight,
        font,
        fontSize,
        textDecoration,
        textAlign,
        shadow,
        border,
        transition,
        row,
        column,
        alignContent,
        alignItems,
        basis,
        flexDirection,
        grow,
        shrink,
        justifyContent,
        wrap,
        flex,
        flow,
        alignSelf,
        align,
        gap,
        ...all
    } = props

    const className = classNames(
        {
            'f-row': props.row,
            'f-col': props.column,
        },
        [props.className, getAlignClass(props.align)]
    )

    // Create inline style object from shorthand props
    // and from inline style props
    const style = useMemo(() => {
        const { style = {} } = props

        return cleanObject({
            background: props.bgToken ? getColorToken(props.bgToken) : props.bg,
            color: props.colorToken ? getColorToken(props.colorToken) : props.color,
            width: props.width,
            height: props.height,
            position: props.position,
            display: props.display,
            padding: props.p,
            margin: props.m,
            zIndex: props.zIndex,
            borderRadius: props.radius,
            blur: props.blur,
            letterSpacing: props.letterSpacing,
            lineHeight: props.lineHeight,
            fontWeight: props.fontWeight,
            fontFamily: props.font,
            fontSize: props.fontSize,
            textDecoration: props.textDecoration,
            textAlign: props.textAlign,
            boxShadow: props.shadow,
            border: props.border,
            transition: props.transition,
            alignItems: props.alignItems,
            alignContent: props.alignContent,
            flexBasis: props.basis,
            flexDirection: props.flexDirection,
            flexGrow: props.grow,
            justifyContent: props.justifyContent,
            flexShrink: props.shrink,
            flexWrap: props.wrap,
            flex: props.flex,
            flow: props.flow,
            alignSelf: props.alignSelf,
            gap: props.gap,
            ...style,
        })
    }, [props])

    return createElement(
        as,
        {
            ...all,
            className,
            style,
            ref,
        },
        props.children
    )
})

export const Flexer = (props: any) => <div style={{ flex: 1 }} />

export const Flex = View

export type BlurProps = {
    overlay?: any
} & CoreViewProps

export const Blur = (props: BlurProps) => {
    const { overlay, ...rest } = props
    const [box, setBox] = useState({})
    const containerRef = useRef(null)
    const className = classNames(
        {
            'f-blur': true,
        },
        [props.className]
    )

    useLayoutEffect(() => {
        setBox(getOffset(containerRef.current))
    }, [])

    return (
        <>
            {overlay && (
                <div
                    style={box}
                    className="f-blur-overlay">
                    {overlay}
                </div>
            )}
            <View
                {...rest}
                className={className}
                ref={containerRef}
            />
        </>
    )
}
