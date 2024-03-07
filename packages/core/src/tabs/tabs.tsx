import React, {
    cloneElement,
    createContext,
    forwardRef,
    ReactElement,
    useContext,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Button, IconLib, useId, View } from '..'
import { classNames, getActionClass, getOffset, renderChildren, waitForRender } from '../helpers'
import { useResize } from '../hooks/resize.hook'
import { Text } from '../text/text'
import { CoreViewProps, Size } from '../types'

export const TabsContext = createContext({
    box: {},
    setBox: ({}) => null,
})

export const TabsProvider = (props: any) => {
    const [box, setBox] = useState({})
    return <TabsContext.Provider value={{ box, setBox }}>{props.children}</TabsContext.Provider>
}

export type TabsProps = {
    animated?: boolean
    layout?: 'bottom' | 'top' | 'left' | 'right'
    selected: number
    onSelect?: (index: number) => void
} & Omit<CoreViewProps, 'onSelect'>

export const Tabs = forwardRef((props: TabsProps, ref) => {
    return (
        <TabsProvider>
            <TabsInner
                {...props}
                ref={ref}
            />
        </TabsProvider>
    )
})

export const TabsInner = forwardRef((props: TabsProps, ref) => {
    const { animated = false, layout = 'top', selected, onSelect, ...rest } = props
    const id = useId()
    const { list, panels } = useMemo(() => {
        let list,
            panels = null
        React.Children.toArray(props.children).map((child: any) => {
            if (child.type == TabList) list = child
            if (child.type == TabPanels) panels = child
        })
        return { list, panels }
    }, [props.children])
    const className = classNames(
        {
            'f-tabs': true,
            'f-row': layout == 'left' || layout == 'right',
            'f-col': layout == 'top' || layout == 'bottom',
        },
        [props.className, getActionClass(layout)]
    )

    if (layout == 'top' || layout == 'left') {
        return (
            <View
                {...rest}
                className={className}>
                {list && cloneElement(list, { ...list.props, onSelect, selected, layout, id, animated })}
                {panels && cloneElement(panels, { ...panels.props, selected, id })}
            </View>
        )
    } else {
        return (
            <View
                {...rest}
                className={className}>
                {list && cloneElement(panels, { ...panels.props, selected, id })}
                {panels && cloneElement(list, { ...list.props, onSelect, selected, layout, id, animated })}
            </View>
        )
    }
})

export type TabListProps = {
    stretch?: boolean
    disableScroll?: boolean
    scrollJump?: number
    animated?: boolean
    layout?: 'bottom' | 'top' | 'left' | 'right'
    selected?: number
    onSelect?: (index: number) => void
    icons?: any
} & Omit<CoreViewProps, 'onSelect'>

export const TabList = (props: TabListProps) => {
    const {
        stretch,
        disableScroll,
        animated,
        scrollJump = 120,
        layout = 'top',
        selected,
        onSelect,
        icons = {
            moreV: 'chevron-down',
            lessV: 'chevron-up',
            moreH: 'chevron-right',
            lessH: 'chevron-left',
        },
        ...rest
    } = props
    const { box } = useContext(TabsContext)
    const listRef = useRef(null)
    const [overflowStart, setOverflowStart] = useState(false)
    const [overflowEnd, setOverflowEnd] = useState(false)
    const isRow = layout == 'top' || layout == 'bottom'
    const isCol = layout == 'left' || layout == 'right'
    const iconMore = isRow ? icons.lessH : icons.lessV
    const iconLess = isRow ? icons.moreH : icons.moreV
    const dimensions = useResize(listRef.current)
    const className = classNames(
        {
            'f-tab-list': true,
            'is-vertical': isCol,
            'is-horizontal': isRow,
            'f-row': isRow,
            'f-col': isCol,
            'is-stretch': stretch,
        },
        [getActionClass(layout)]
    )
    const classNameInner = classNames({
        'f-tab-list__inner': true,
        'f-row': isRow,
    })
    const classNameInnerContainer = classNames({
        'f-tab-list__inner-container': true,
        'f-row': isRow,
    })

    const handleScrollLess = () => {
        if (isRow) {
            listRef.current.scrollLeft -= scrollJump
        } else {
            listRef.current.scrollTop -= scrollJump
        }
    }

    const handleScrollMore = () => {
        if (isRow) {
            listRef.current.scrollLeft += scrollJump
        } else {
            listRef.current.scrollTop += scrollJump
        }
    }

    const toggleRowButtonVisibility = (element) => {
        setOverflowStart(element.scrollLeft > 0)
        setOverflowEnd(element.scrollLeft < element.scrollWidth - element.offsetWidth)
    }

    const toggleColButtonVisibility = (element) => {
        setOverflowStart(element.scrollTop > 0)        
        setOverflowEnd(element.scrollTop < element.scrollHeight - element.offsetHeight - 1) // TODO: why the +1?
    }

    const calculateScroll = () => {
        if (disableScroll) {
            setOverflowStart(false)
            setOverflowEnd(false)
            return
        }

        // if there is overflow for rows
        if (isRow) {
            if (listRef.current.offsetWidth < listRef.current.scrollWidth) {
                toggleRowButtonVisibility(listRef.current)
            } else {
                setOverflowStart(false)
                setOverflowEnd(false)
            }
        }

        // if there is overflow for columns
        if (isCol) {
            if (listRef.current.offsetHeight < listRef.current.scrollHeight) {
                toggleColButtonVisibility(listRef.current)
            } else {
                setOverflowStart(false)
                setOverflowEnd(false)
            }
        }
    }

    useLayoutEffect(() => {
        calculateScroll()
    }, [dimensions, layout])

    return (
        <View
            {...rest}
            role="tablist"
            className={className}
            aria-orientation={isCol ? 'vertical' : 'horizontal'}>
            {overflowStart && (
                <div className="f-tab-list__icon is-start f-row">
                    <Button 
                        size="xs" 
                        border="none" 
                        shadow="var(--f-shadow-lg)"
                        onClick={handleScrollLess}>
                        <IconLib icon={iconMore} size="sm" />
                    </Button>
                </div>
            )}

            <div
                onScroll={(e) => isRow ? toggleRowButtonVisibility(e.currentTarget) : toggleColButtonVisibility(e.currentTarget)}
                className={classNameInner}
                ref={listRef}>
                <div className={classNameInnerContainer}>
                    {renderChildren(props.children, (child: ReactElement, index) => {
                        return cloneElement(child, {
                            ...child.props,
                            'animated': animated,
                            'selected': selected == index,
                            'onSelect': () => onSelect(index),
                            'id': props.id ? `${props.id}-tab-${index}` : null,
                            'aria-controls': props.id ? `${props.id}-panel-${index}` : null,
                        })
                    })}
                </div>

                {/* animated selected bar */}
                {selected >= 0 && animated && (
                    <div
                        className="f-tab-list__selected"
                        style={box}>
                        <div className="f-tab-list__selected-inner" />
                    </div>
                )}
            </div>

            {overflowEnd && (
                <div className="f-tab-list__icon is-end f-row">
                    <Button 
                        size="xs" 
                        border="none" 
                        shadow="var(--f-shadow-lg)"
                        onClick={handleScrollMore}>
                        <IconLib icon={iconLess} size="sm" />
                    </Button>
                </div>
            )}
        </View>
    )
}

export type TabPanelsProps = {
    selected?: number
} & CoreViewProps

export const TabPanels = (props: TabPanelsProps) => {
    const { selected, ...rest } = props
    const className = classNames(
        {
            'f-tab-panels': true,
            'f-col': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            className={className}>
            {renderChildren(props.children, (child: ReactElement, index) => {
                if (selected != index) return null

                return cloneElement(child, {
                    ...child.props,
                    'id': props.id ? `${props.id}-panel-${index}` : null,
                    'aria-labelledby': props.id ? `${props.id}-tab-${index}` : null,
                    'selected': selected == index,
                })
            })}
        </View>
    )
}

export type TabPanelProps = {
    selected?: boolean
} & CoreViewProps

export const TabPanel = (props: TabPanelProps) => {
    const { selected, ...rest } = props
    const className = classNames(
        {
            'f-tab-panel': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            role="tabpanel"
            className={className}
            aria-selected={props.selected}
            aria-labelledby={props['aria-labelledby']}>
            {props.children}
        </View>
    )
}

export type TabProps = {
    animated?: boolean
    prefix?: any
    suffix?: any
    size?: Size
    disabled?: boolean
    selected?: boolean
    onSelect?: any
} & CoreViewProps

export const Tab = (props: TabProps) => {
    const { animated, size = 'md', disabled, selected, onSelect, prefix, suffix, ...rest } = props
    const { setBox } = useContext(TabsContext)
    const containerRef = useRef(null)
    const dimensions = useResize(containerRef.current)
    const className = classNames(
        {
            'f-tab': true,
            'f-row': true,
            'is-selected': selected,
        },
        [props.className]
    )

    useLayoutEffect(() => {
        if (selected) setBox(getOffset(containerRef.current))
    }, [selected, dimensions])

    return (
        <Text
            {...rest}
            as="button"
            role="tab"
            size={size}
            disabled={disabled}
            className={className}
            onClick={onSelect}
            ref={containerRef}>
            {prefix && <span className="f-tab__prefix f-row">{prefix}</span>}
            <span className="f-tab__label">{props.children}</span>
            {suffix && <span className="f-tab__suffix f-row">{suffix}</span>}
            {/* selected bar */}
            {selected && !animated && <span className="f-tab__active" />}
        </Text>
    )
}
