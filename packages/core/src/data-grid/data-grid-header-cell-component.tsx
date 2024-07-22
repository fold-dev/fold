import { CommonProps, ContextMenuContext, IconLib, Text } from '@fold-dev/core'
import React, { ReactNode, useContext } from 'react'

export type DataGridHeaderCellComponentProps = {
    id: string
    label: string
    sortOrder?: 'ASC' | 'DESC'
    menu?: boolean
    prefix?: ReactNode
    suffix?: ReactNode
    align?: 'left' | 'right' | 'center'
    onClick: (value) => void
} & CommonProps

export const DataGridHeaderCellComponent = (props: DataGridHeaderCellComponentProps) => {
    const { id, label, sortOrder, menu, prefix, suffix, align = 'left', onClick } = props
    const { setMenu } = useContext(ContextMenuContext)

    const handleMenuClick = (e) => {
        e.preventDefault()
        e.stopPropagation()

        setMenu(
            {
                target: 'column',
                payload: { id, label, sortOrder },
            },
            { x: e.clientX, y: e.clientY }
        )
    }

    return (
        <div
            className="f-data-grid-header-cell-component f-row"
            onClick={onClick}>
            {prefix}

            {!!sortOrder && (
                <IconLib
                    size="xs"
                    icon={sortOrder == 'ASC' ? 'arrow-up' : 'arrow-down'}
                    className="f-buttonize f-data-grid-header-cell-component__sort-icon"
                    style={{
                        width: '0.7rem',
                        height: '0.7rem',
                    }}
                />
            )}

            <div className="f-data-grid-header-cell-component__text f-row">
                <div
                    style={{ textAlign: align, width: '100%' }}
                    className="f-ellipsis f-text">
                    {label}
                </div>
            </div>

            {menu && (
                <IconLib
                    icon="more-v"
                    className="f-buttonize"
                    onClick={handleMenuClick}
                />
            )}

            {suffix}
        </div>
    )
}
