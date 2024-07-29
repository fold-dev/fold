import React, { useContext } from 'react'
import { CsvImporterContext, Heading, Text, View } from '../'

export type CsvImporterDoneProps = {}

export const CsvImporterDone = (props: CsvImporterDoneProps) => {
    const {
        options: {
            text: {
                complete: { title, description },
            },
        },
    } = useContext(CsvImporterContext)

    return (
        <View
            column
            gap={10}
            width="100%"
            height={500}>
            <Heading>{title}</Heading>
            <Text>{description}</Text>
        </View>
    )
}
