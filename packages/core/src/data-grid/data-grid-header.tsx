import { Checkbox, CoreViewProps, View, classNames } from '@fold-dev/core'
import React, { FunctionComponent, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { DataGridContext } from './data-grid.provider'
import { DataGridHeaderCell } from './data-grid-header-cell'
import { DataGridDefaultCellComponent } from './data-grid-default-cell-component'
import { DataGridTypes } from './data-grid.types'

export type DataGridHeaderProps = {
    sticky?: boolean
    columns: DataGridTypes.Column[]
    hideCheckbox?: boolean
    component?: FunctionComponent
    resizableColumns?: boolean
    onWidthChange?: (index, value) => void
    onColumnClick?: (index, value) => void
} & CoreViewProps

export const DataGridHeader = (props: DataGridHeaderProps) => {
    const { columns, onWidthChange, hideCheckbox, component, resizableColumns, onColumnClick, ...rest } = props
    const {
        rowSelection,
        setRowSelection,
        cellSelection,
        setCellSelection,
        rowSelectionIndeterminate,
        allRowsSelected,
        selectAllRows,
        maxRowsSelectable,
        singleRowSelect,
        dragCol,
        setTotalColumns,
        setWidths,
    } = useContext(DataGridContext)
    const id = `hr`
    const selected = !!rowSelection[id]
    const checked = useMemo(
        () => allRowsSelected || rowSelectionIndeterminate,
        [allRowsSelected, rowSelectionIndeterminate]
    )
    const showCheckbox = useMemo(() => {
        if (hideCheckbox) return false
        return !singleRowSelect
    }, [singleRowSelect, hideCheckbox])
    const className = classNames({
        'f-data-grid-row': true,
        'is-header': true,
        'is-selected': selected,
    })

    useEffect(() => {
        setTotalColumns(columns.length)
    }, [columns.length])

    return (
        <View
            {...rest}
            className={className}>
            <DataGridHeaderCell
                index={0}
                disableWidthChange
                component={DataGridDefaultCellComponent}>
                {showCheckbox && (
                    <Checkbox
                        id="c-checkbox"
                        checked={checked}
                        onChange={selectAllRows}
                        indeterminate={rowSelectionIndeterminate}
                    />
                )}
            </DataGridHeaderCell>

            {columns.map((column: DataGridTypes.Column, index) => (
                <DataGridHeaderCell
                    key={column.id}
                    index={index + 1}
                    disableWidthChange={!resizableColumns}
                    onWidthChange={(width) => onWidthChange(index, width)}
                    onClick={(e) => onColumnClick(index, column)}
                    component={component}
                    {...column}
                />
            ))}
        </View>
    )
}
