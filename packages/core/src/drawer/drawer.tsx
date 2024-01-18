import React, { useMemo } from 'react'
import { Modal, ModalAnchor, ModalProps } from '../'
import { classNames, getActionClass } from '../helpers'

export type DrawerProps = {
    anchor?: 'left' | 'right' | 'top' | 'bottom'
} & Omit<ModalProps, 'anchor'>

export const Drawer = (props: DrawerProps) => {
    const { anchor = 'right', width, height, ...rest } = props
    const dimensions = useMemo(() => {
        return {
            height: anchor == 'left' || anchor == 'right' ? '100%' : height,
            width: anchor == 'top' || anchor == 'bottom' ? '100%' : width,
            anchor:
                anchor == 'right'
                    ? 'top-right'
                    : anchor == 'left'
                    ? 'top-left'
                    : anchor == 'top'
                    ? 'top-left'
                    : 'bottom-left',
        }
    }, [anchor])
    const className = classNames(
        {
            'f-drawer': true,
        },
        [getActionClass(anchor), props.className]
    )

    return (
        <Modal
            {...rest}
            width={dimensions.width}
            height={dimensions.height}
            anchor={dimensions.anchor as ModalAnchor}
            radius={0}
            border="none"
            className={className}
        />
    )
}
