import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button, CsvImporterContext, Divider, IconLib, If, Select, SelectOption, Text, View, useVisibility } from '../'

export type CsvImporterColumnMapRowProps = {
    column: any
    selected: SelectOption
    index: number
    onSelect: (value) => void
}

export const CsvImporterColumnMapRow = (props) => {
    const { column, selected, index, onSelect } = props
    const { visible, show, hide } = useVisibility(true)
    const { schema, sample } = useContext(CsvImporterContext)
    const [sampleData, setSampleData] = useState([])
    const options = useMemo(
        () =>
            schema.map(({ key, label }) => ({
                key,
                label,
            })),
        [schema]
    )

    const handleSelect = (option, dismiss) => {
        onSelect(option.key)
        dismiss()
    }

    useEffect(() => {
        setSampleData(sample.map((row: any) => row[index].value))
    }, [sample])

    return (
        <If if={visible}>
            <View
                row
                width="100%"
                p="1rem 0"
                gap="1rem"
                alignItems="flex-start">
                <View
                    flex={1}
                    p="0 0 0 1rem">
                    <Text fontWeight="var(--f-font-weight-bold)">{column.value}</Text>
                </View>
                <View
                    flex={1}
                    style={{ overflow: 'hidden' }}>
                    {sampleData.map((text, index) => (
                        <Text
                            key={index}
                            display="inline-block"
                            className="f-ellipsis"
                            width="100%">
                            {text}
                        </Text>
                    ))}
                </View>
                <View flex={2}>
                    <Select
                        width="100%"
                        suffix={<IconLib icon="chevron-down" />}
                        placeholder="Select a schema field"
                        options={options}
                        selected={selected}
                        onSelect={handleSelect}
                    />
                </View>
                <View
                    width={60}
                    row>
                    <Button
                        subtle
                        colorToken="text-weakest"
                        onClick={hide}>
                        <IconLib icon="x" />
                    </Button>
                </View>
            </View>

            <Divider />
        </If>
    )
}
