import React, { useContext, useEffect, useState } from 'react'
import { CsvImporterColumnMapRow, CsvImporterContext, Text, View } from '../'

export type CsvImporterColumnMapProps = {}

export const CsvImporterColumnMap = (props: CsvImporterColumnMapProps) => {
    const {
        header,
        mapping,
        records,
        setMapping,
        options: {
            text: { map },
        },
    } = useContext(CsvImporterContext)
    const [schemaSelection, setSchemaSelection] = useState({})
    const [setup, setSetup] = useState(false)

    const handleSelection = (index, key) => {
        const updatedSchemaSelection = { ...schemaSelection }
        const existingIndex = Object.keys(updatedSchemaSelection).find((index) => updatedSchemaSelection[index] == key)

        if (existingIndex == undefined) {
            setSchemaSelection({ ...updatedSchemaSelection, [index]: key })
        } else {
            delete updatedSchemaSelection[existingIndex]
            setSchemaSelection({ ...updatedSchemaSelection, [index]: key })
        }
    }

    useEffect(() => {
        if (setup) return
        if (!!Object.keys(mapping).length) setSchemaSelection(mapping)
        setSetup(true)
    }, [mapping, setup])

    useEffect(() => {
        if (!setup) return
        setMapping(schemaSelection)
    }, [schemaSelection, setup])

    return (
        <View
            column
            gap="0.2rem"
            width="100%"
            height={500}
            position="relative"
            justifyContent="flex-start"
            style={{ overflowY: 'auto' }}>
            <View
                row
                p="1rem 0"
                width="100%"
                position="sticky"
                zIndex={100}
                style={{ top: 0 }}
                bgToken="surface-strong">
                <View
                    flex={1}
                    p="0 0 0 1rem">
                    <Text>{map.data}</Text>
                </View>
                <View flex={1}>
                    <Text>{map.sample}</Text>
                </View>
                <View flex={2}>
                    <Text>{map.schema}</Text>
                </View>
                <View width={60} />
            </View>
            {header.map((column: any, index) => (
                <CsvImporterColumnMapRow
                    key={index}
                    column={column}
                    index={index}
                    selected={schemaSelection[index] ? [schemaSelection[index]] : []}
                    onSelect={(key) => handleSelection(index, key)}
                />
            ))}
        </View>
    )
}
