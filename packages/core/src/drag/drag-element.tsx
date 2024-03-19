import React, {
    useMemo,
    useRef
} from 'react'
import {
    classNames,
    CoreViewProps,
    useDrag,
    View
} from '../'

export type DragElementProps = {
    id?: string
    indent?: number
    noDrop?: boolean
    noDrag?: boolean
} & Omit<CoreViewProps, 'indent'>

export const DragElement = (props: DragElementProps) => {
    const { id, indent = 0, noDrop, noDrag, style = {}, ...rest } = props
    const fallbackDisplay = useMemo(() => style.display, [style])
    const { onMouseDown, onMouseUp } = useDrag()
    const elementRef = useRef(null)
    const styles = useMemo(
        () => ({
            ...style,
            width: indent ? `calc(100% - var(--f-drag-indent) * ${indent})` : '100%',
            marginLeft: indent ? `calc(var(--f-drag-indent) * ${indent})` : undefined,
        }),
        [style, indent]
    )
    const className = classNames(
        {
            'f-drag-element': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            id={id}
            data-id={id}
            data-indent={indent}
            data-nodrop={noDrop}
            data-nodrag={noDrag}
            data-fallbackdisplay={fallbackDisplay} // see DragElementArea
            data-dragelement={true}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={styles}
            ref={elementRef}
            className={className}>
            {props.children}
        </View>
    )
}
