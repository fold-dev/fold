import React, { useContext, useEffect, useMemo } from 'react'
import { CSVtoArray, CsvImporterContext, DataGrid, DataGridProvider, Text, View, useDataGridEvent } from '../'

export type CsvImporterHeaderSelectProps = {}

export const CsvImporterHeaderSelect = (props: CsvImporterHeaderSelectProps) => {
    const {
        options: {
            text: { header },
        },
    } = useContext(CsvImporterContext)
    const { separator, fileData, setHeader, setRecords, setSample } = useContext(CsvImporterContext)
    const { rows, columnWidths } = useMemo(() => {
        const rows = CSVtoArray(fileData, separator).map((row: any) =>
            row.map((value) => ({
                value,
                disableEdit: true,
                disableSelect: true,
            }))
        )
        const hasRows = !!rows.length
        const columnWidths = hasRows ? rows[0].map(() => '150px') : ['150px']
        if (hasRows) {
            if (!rows[rows.length - 1].value) rows.pop()
        }
        return { rows, columnWidths }
    }, [fileData])

    const handleRowSelection = (selection: any) => {
        if (!Object.keys(selection)[0]) {
            setHeader(null)
            return
        }

        const index = +Object.keys(selection)[0].replace('r-', '')
        const header = [...rows[index]]
        const leftoverRows: any = [...rows]

        // cut the index away
        leftoverRows.splice(index, 1)

        setRecords(leftoverRows)
        setSample(leftoverRows.slice(0, 3))
        setHeader(header.map((h) => ({ value: h.value })))
    }

    const handleDataGridRowSelection = ({ detail }) => {
        const { instanceId, selection } = detail
        handleRowSelection(selection)
    }

    useEffect(() => {
        if (!!rows.length) handleRowSelection({ 'r-0': true })
    }, [rows])

    useDataGridEvent('row-selection', handleDataGridRowSelection)

    return (
        <View
            column
            gap={10}
            width="100%">
            <DataGridProvider
                singleRowSelect
                columnWidths={columnWidths}
                defaultRowSelection={{ 'r-0': true }}>
                <DataGrid
                    rows={rows}
                    width="100%"
                    variant="virtual"
                    pinFirst
                    virtual={{
                        rows: 9,
                        rowHeight: 40,
                        paddingTop: 0,
                        // there is usually a header, but here we manually remove the double border
                        paddingBottom: -1,
                    }}
                />
            </DataGridProvider>
            <View
                row
                width="100%">
                <Text
                    size="sm"
                    fontWeight="bold"
                    colorToken="text-weaker">
                    {rows.length} {rows.length == 1 ? header.row : header.rows}
                </Text>
            </View>
        </View>
    )
}
