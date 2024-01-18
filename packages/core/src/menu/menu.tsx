import React, {
    cloneElement,
    ReactElement,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Button, ButtonProps, Heading, HeadingProps, Popover, PopoverProps, Text, useVisibility, View } from '../'
import { classNames, getBoundingClientRect, getKey, isOffScreen, renderChildren, renderWithProps } from '../helpers'
import { IconLib } from '../icon'
import { CoreViewProps, Size } from '../types'

export type MenuButtonProps = {
    menu: any
    popoverProps?: PopoverProps
} & ButtonProps

export const MenuButton = (props: MenuButtonProps) => {
    const { menu, popoverProps, ...rest } = props
    const { show, hide, visible } = useVisibility()

    return (
        <Popover
            border="none"
            {...popoverProps}
            width="fit-content"
            isVisible={visible}
            onDismiss={hide}
            content={menu({ dismiss: hide })}>
            <Button
                {...rest}
                aria-expanded={visible}
                onClick={show}
            />
        </Popover>
    )
}

export type MenuItemOptionProps = {
    value?: string | number
    type?: 'radio' | 'checkbox'
} & MenuItemProps

export const MenuItemOption = (props: MenuItemOptionProps) => {
    const { type = 'checkbox', value, ...rest } = props
    const role = 'menuitem' + type

    return (
        <MenuItem
            {...rest}
            role={role}
            prefix={
                <IconLib
                    icon="check"
                    style={{ visibility: props.active ? 'visible' : 'hidden' }}
                />
            }
        />
    )
}

export type MenuOptionGroupProps = {
    defaultValue?: string
    title?: string
    type?: 'radio' | 'checkbox'
    onChange?: any
} & CoreViewProps

export const MenuOptionGroup = (props: MenuOptionGroupProps) => {
    const { defaultValue = '', title, type = 'checkbox', onChange, ...rest } = props
    const [checked, setChecked] = useState([...defaultValue.split(',')])
    const className = classNames(
        {
            'f-menu-optiongroup': true,
        },
        [props.className]
    )

    const handleClick = (value) => {
        if (checked.includes(value)) {
            setChecked(checked.filter((c) => c != value))
        } else {
            if (type == 'checkbox') {
                const newValue = [...checked, value]
                setChecked(newValue)
                if (onChange) onChange(newValue)
            } else {
                setChecked([value])
                if (onChange) onChange(value)
            }
        }
    }

    return (
        <View
            {...rest}
            role="group"
            className={className}>
            {title && <MenuHeading>{title}</MenuHeading>}

            {renderChildren(props.children, (child: ReactElement, index: number) => {
                return cloneElement(child, {
                    ...child.props,
                    type,
                    onClick: () => handleClick(child.props.value),
                    active: checked.includes(child.props.value),
                })
            })}
        </View>
    )
}

export type MenuProps = {
    disableAutoFocus?: boolean
    variant?: 'menu' | 'menubar'
    width?: number | string
    closeFromParenMenuItem?: any
    isSubmenu?: boolean
} & CoreViewProps

export const Menu = (props: MenuProps) => {
    const { disableAutoFocus, variant = 'menu', width, isSubmenu, closeFromParenMenuItem, style = {}, ...rest } = props
    const isMenubar = variant == 'menubar'
    const role = isMenubar ? 'menubar' : 'menu'
    const menuRef = useRef(null)
    const focusRef = useRef(null)
    const menuItemRefs = useRef([])
    const [offscreen, setOffscreen] = useState<any>({})
    const styles = useMemo(() => {
        return {
            ...style,
            width: width ? width : isMenubar ? 'fit-content' : 250,
            top: offscreen.bufferY < 0 ? offscreen.bufferY : undefined,
        }
    }, [style, width, offscreen])
    const className = classNames(
        {
            'f-menu': true,
            'is-menubar': isMenubar,
            'f-row': isMenubar,
            'is-offscreen-x': offscreen.offscreenX && isSubmenu,
            'is-offscreen-y': offscreen.offscreenY && isSubmenu,
        },
        [props.className]
    )

    const closeFromMenu = () => {
        if (closeFromParenMenuItem) closeFromParenMenuItem()
    }

    const firstMenuItem = () => menuItemRefs.current[0]

    const lastMenuItem = () => menuItemRefs.current[menuItemRefs.current.length - 1]

    const setFocusToCache = () => {
        focusRef.current?.focus()
    }

    const setFocusToFirstMenuitem = () => {
        setFocusToMenuitem(firstMenuItem())
    }

    const setFocusToLastMenuitem = () => {
        setFocusToMenuitem(lastMenuItem())
    }

    const setFocusToMenuitem = (newMenuitem) => {
        menuItemRefs.current.forEach((item) => {
            if (item === newMenuitem) {
                item.tabIndex = 0
                newMenuitem.focus()
                focusRef.current = newMenuitem
            } else {
                item.tabIndex = -1
            }
        })
    }

    const setFocusToPreviousMenuitem = (currentMenuitem) => {
        var newMenuitem, index
        if (currentMenuitem === firstMenuItem()) {
            newMenuitem = lastMenuItem()
        } else {
            index = menuItemRefs.current.indexOf(currentMenuitem)
            newMenuitem = menuItemRefs.current[index - 1]
        }
        setFocusToMenuitem(newMenuitem)
    }

    const setFocusToNextMenuitem = (currentMenuitem) => {
        var newMenuitem, index

        if (currentMenuitem === lastMenuItem()) {
            newMenuitem = firstMenuItem()
        } else {
            index = menuItemRefs.current.indexOf(currentMenuitem)
            newMenuitem = menuItemRefs.current[index + 1]
        }
        setFocusToMenuitem(newMenuitem)
    }

    const handleKeyDown = (e) => {
        e.stopPropagation()
        const { isEscape } = getKey(e)
        if (isEscape && closeFromParenMenuItem) closeFromParenMenuItem()
    }

    useLayoutEffect(() => {
        // Get the number of child nodes into cache
        // We'll use these to iterate over for focus
        const childNodes = menuRef.current.querySelectorAll(':scope > span > a:not(.is-disabled)[role="menuitem"]')

        // Set as an array
        menuItemRefs.current = [...childNodes]

        // Calculate if we need to shift the menus
        setOffscreen(isOffScreen(menuRef.current))
    }, [])

    useEffect(() => {
        if (!disableAutoFocus) setFocusToFirstMenuitem()
    }, [disableAutoFocus])

    return (
        <View
            {...rest}
            as="div"
            ref={menuRef}
            className={className}
            role={role}
            style={styles}
            onKeyDown={handleKeyDown}>
            {renderChildren(props.children, (child: ReactElement, index) => {
                if (child.type == MenuItem) {
                    return cloneElement(child, {
                        ...child.props,
                        setFocusToPreviousMenuitem,
                        setFocusToNextMenuitem,
                        setFocusToFirstMenuitem,
                        setFocusToLastMenuitem,
                        setFocusToCache,
                        closeFromMenu,
                    })
                } else {
                    return child
                }
            })}
        </View>
    )
}

export type MenuItemProps = {
    role?: string
    size?: Size
    menu?: ReactElement
    target?: string
    href?: string
    label?: string
    prefix?: ReactElement
    suffix?: ReactElement
    disabled?: boolean
    active?: boolean
    onClick?: any
    tabIndex?: number
    setFocusToPreviousMenuitem?: any
    setFocusToNextMenuitem?: any
    setFocusToFirstMenuitem?: any
    setFocusToLastMenuitem?: any
    setFocusToCache?: any
    closeFromMenu?: any
    anchorProps?: Omit<CoreViewProps, 'ShorthandProps'>
} & CoreViewProps

export const MenuItem = (props: MenuItemProps) => {
    const {
        role = 'menuitem',
        size,
        menu,
        target,
        href,
        label,
        prefix,
        suffix,
        disabled,
        active,
        onClick,
        tabIndex,
        setFocusToPreviousMenuitem,
        setFocusToNextMenuitem,
        setFocusToFirstMenuitem,
        setFocusToLastMenuitem,
        setFocusToCache,
        closeFromMenu,
        anchorProps = {},
        ...rest
    } = props
    const menuItemRef = useRef<any>()
    const [open, setOpen] = useState(false)
    const hasSubmenu = !!menu
    const className = classNames(
        {
            'f-menu-item': true,
            'is-open': open,
        },
        [props.className]
    )
    const classNameInner = classNames({
        'f-menu-item__container': true,
        'f-row': true,
        'is-active': active,
        'is-disabled': disabled,
    })

    const closeMenu = () => {
        setOpen(false)
    }

    const openMenu = () => {
        setOpen(true)
    }

    const handleMouseLeave = (e) => {
        menuItemRef.current?.blur()
        closeMenu()
    }

    const handleMouseEnter = (e) => {
        menuItemRef.current?.focus()
        openMenu()
    }

    const handleClick = (e) => {
        if (disabled) return

        if (hasSubmenu) {
            setOpen(!open)
        } else {
            if (onClick) onClick(e)
        }
    }

    const handleKeyDown = (e) => {
        let flag = false
        const target = e.currentTarget
        const { isEnter, isUp, isDown, isLeft, isRight, isPageUp, isPageDown } = getKey(e)

        if (e.ctrlKey || e.altKey || e.metaKey) return

        if (isUp) {
            setFocusToPreviousMenuitem(target)
            flag = true
        }

        if (isDown) {
            setFocusToNextMenuitem(target)
            flag = true
        }

        if (isPageUp) {
            setFocusToFirstMenuitem()
            flag = true
        }

        if (isPageDown) {
            setFocusToLastMenuitem()
            flag = true
        }

        if (isLeft) {
            if (closeFromMenu) closeFromMenu()
            flag = true
        }

        if (isRight || (hasSubmenu && isEnter)) {
            openMenu()
            flag = true
        }

        if (!hasSubmenu && isEnter) {
            if (onClick) onClick(e)
            flag = true
        }

        if (flag) {
            e.stopPropagation()
            e.preventDefault()
        }
    }

    const closeFromParenMenuItem = () => {
        setOpen(false)
        setFocusToCache()
    }

    return (
        <View
            {...rest}
            as="span"
            role="none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={className}>
            <a
                role={role}
                ref={menuItemRef}
                tabIndex={tabIndex}
                href={href}
                target={target}
                aria-checked={active}
                aria-haspopup={hasSubmenu}
                aria-expanded={open}
                aria-label={label}
                className={classNameInner}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                {...anchorProps}>
                {active && <span className="f-menu-item__active" />}
                {prefix && <span className="f-menu-item__prefix f-row">{prefix}</span>}
                <Text
                    as="span"
                    className="f-menu-item__label"
                    size={size}>
                    {props.children}
                </Text>
                {suffix && <span className="f-menu-item__suffix f-row">{suffix}</span>}
            </a>
            {open &&
                renderWithProps(menu, {
                    isSubmenu: true,
                    closeFromParenMenuItem,
                })}
        </View>
    )
}

export const MenuHeading = (props: { headingProps?: HeadingProps } & CoreViewProps) => {
    const { headingProps = {}, ...rest } = props

    return (
        <View
            {...rest}
            as="span"
            role="none"
            className="f-menu-heading">
            <Heading
                {...headingProps}
                as="h6"
                className="f-menu-heading__heading">
                {props.children}
            </Heading>
        </View>
    )
}

export const MenuSection = (props: CoreViewProps) => {
    return (
        <View
            {...props}
            as="span"
            role="none"
            className="f-menu-section"
        />
    )
}

export const MenuDivider = (props: CoreViewProps) => {
    return (
        <View
            {...props}
            as="span"
            role="seperator"
            className="f-menu-divider">
            <hr />
        </View>
    )
}

export const ContextMenuContext = React.createContext<any>({
    setMenu: (data: any, position: any) => {},
})

export type MenuProviderProps = {
    menu: any
    children: any
    popoverProps?: PopoverProps
}

export const MenuProvider = (props: MenuProviderProps) => {
    const { menu, children, popoverProps = {} } = props
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const isVisible = position.x != 0 && position.y != 0
    const [data, setData] = useState<any>({})

    const setMenu = (data: any, position: any) => {
        setPosition(position)
        setData(data)
    }

    const dismiss = () => {
        setPosition({ x: 0, y: 0 })
        setData({})
    }

    return (
        <Popover
            {...popoverProps}
            border="none"
            width="fit-content"
            isVisible={isVisible}
            fixPosition={{ left: position.x, top: position.y }}
            content={menu({ data, dismiss })}
            onDismiss={() => setPosition({ x: 0, y: 0 })}>
            <ContextMenuContext.Provider value={{ setMenu, data, dismiss }}>{children}</ContextMenuContext.Provider>
        </Popover>
    )
}

export type MenuContextProps = {
    data: any
} & CoreViewProps

export const MenuContext = (props: MenuContextProps) => {
    const { data, ...rest } = props
    const surfaceRef = useRef(null)
    const { setMenu } = useContext(ContextMenuContext)

    const handleContextMenuClick = (e) => {
        e.preventDefault()
        setMenu(data, { x: e.clientX, y: e.clientY })
    }

    useLayoutEffect(() => {
        const el: any = surfaceRef.current
        if (el) el.addEventListener('contextmenu', handleContextMenuClick)
        return () => el.removeEventListener('contextmenu', handleContextMenuClick)
    })

    return (
        <View
            {...rest}
            ref={surfaceRef}
        />
    )
}
