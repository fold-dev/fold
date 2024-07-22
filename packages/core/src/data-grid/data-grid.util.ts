import { arrayMove, documentObject, windowObject } from '@fold-dev/core'
import { FunctionComponent, useEffect } from 'react'
import { DataGridTypes } from './data-grid.types'

export type DataGridEventName =
    | 'row-selection'
    | 'clear-row-selection'
    | 'update-cell'
    | 'delete-cell'
    | 'select-rows'
    | 'select-cells'

export const dispatchDataGridEvent = (eventName: DataGridEventName, data: any = {}) =>
    documentObject.dispatchEvent(new CustomEvent('data-grid' + eventName, { detail: data }))

export const useDataGridEvent = (event: DataGridEventName, handler, passive = false) => {
    useEffect(() => {
        documentObject.addEventListener('data-grid' + event, handler, passive)
        return () => documentObject.removeEventListener('data-grid' + event, handler)
    })
}

const sortFunc = (index) => (a, b) => {
    if (typeof a[index].value == 'number') {
        return a[index].value - b[index].value
    } else {
        return a[index].value.localeCompare(b[index].value)
    }
}

export const dataGridState: any = ({
    columnWidths,
    setColumnWidths,
    columnTypes,
    setColumnTypes,
    columns,
    setColumns,
    footerColumns,
    setFooterColumns,
    rows,
    setRows,
}) => ({
    handleColumnMove: ({ origin, target }) => {
        // this isn't present in all examples
        if (columnWidths) setColumnWidths(arrayMove(columnWidths, origin, target))
        if (columnTypes) setColumnTypes(arrayMove(columnTypes, origin, target))
        setColumns(arrayMove(columns, origin, target))
        setFooterColumns(arrayMove(footerColumns, origin, target))
        setRows(rows.map((row) => arrayMove(row, origin, target)))
    },

    handleRowMove: ({ origin, target }) => {
        setRows(arrayMove(rows, origin, target))
    },

    handleColumnClick: (index, column: DataGridTypes.Column) => {
        const { sortFunction } = column

        // if ASC is already set, then we want to reverse it for DESC
        // otherwise if it's DESC or undefined, we simply sort it normally
        if (column.sortOrder == 'ASC') {
            setRows([...rows].reverse())
        } else {
            if (!!sortFunction) {
                setRows([...rows].sort(sortFunction(index)))
            } else {
                setRows([...rows].sort(sortFunc(index)))
            }
        }

        // update sort order
        setColumns(
            columns.map((c: any, i) => {
                if (index == i) {
                    return {
                        ...c,
                        sortOrder: c.sortOrder == 'ASC' ? 'DESC' : 'ASC',
                    }
                } else {
                    return {
                        ...c,
                        sortOrder: undefined,
                    }
                }
            })
        )
    },

    handleCellUpdate: ({ value, row, col }) => {
        setRows(
            rows.map((r, i1) => {
                if (i1 == row) {
                    return r.map((c, i2) => {
                        if (i2 == col) {
                            return { ...c, value }
                        } else {
                            return c
                        }
                    })
                } else {
                    return r
                }
            })
        )
    },

    handleCellDelete: ({ row, col }) => {
        setRows(
            rows.map((r, i1) => {
                if (i1 == row) {
                    return r.map((c, i2) => {
                        if (i2 == col) {
                            return { ...c, value: '' }
                        } else {
                            return c
                        }
                    })
                } else {
                    return r
                }
            })
        )
    },
})
