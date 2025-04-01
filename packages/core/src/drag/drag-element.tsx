import React, { forwardRef, useMemo, useRef } from 'react'
import { classNames, CoreViewProps, mergeRefs, useDrag, View } from '../'

export type DragElementProps = {
    id?: string
    indent?: number
    noDrop?: boolean
    noDrag?: boolean
    noFocus?: boolean
    noIndent?: boolean
    startDelay?: number
} & Omit<CoreViewProps, 'indent'>

export const DragElement = forwardRef((props: DragElementProps, ref) => {
    const { id, indent = 0, noIndent, noDrop, noDrag, noFocus, style = {}, startDelay, ...rest } = props
    const fallbackDisplay = useMemo(() => style.display, [style])
    const { onMouseDown, onMouseUp } = useDrag()
    const elementRef = useRef(null)
    const styles = useMemo(
        () => ({
            ...style,
            width: indent ? `calc(100% - var(--f-drag-indent) * ${indent})` : '100%',
            marginLeft: indent && !noIndent ? `calc(var(--f-drag-indent) * ${indent})` : undefined,
        }),
        [style, indent]
    )
    const className = classNames(
        {
            'f-drag-element': true,
        },
        [props.className]
    )

    const handleMouseUp = (e) => {
        if (props.onMouseUp) props.onMouseUp(e)
        onMouseUp(e)
    }

    const handleMouseDown = (e) => {
        if (props.onMouseDown) props.onMouseDown(e)
        onMouseDown(e, startDelay)
    }

    return (
        <View
            {...rest}
            id={id}
            data-id={id}
            data-indent={indent}
            data-nodrop={noDrop}
            data-nodrag={noDrag}
            data-nofocus={noFocus}
            data-fallbackdisplay={fallbackDisplay} // see DragElementArea
            data-dragelement={true}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            style={styles}
            ref={mergeRefs([ref, elementRef])}
            className={className}>
            {props.children}
        </View>
    )
})
