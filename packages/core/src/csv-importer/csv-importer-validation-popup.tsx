import React, { useContext, useEffect, useState } from 'react'
import { CsvImporterContext, CsvImporterSchemaValidationMessage, IconLib, If, Portal, Text, documentObject, getBoundingClientRect } from '../'

export type CsvImporterValidationPopupProps = {
    validationMessage: CsvImporterSchemaValidationMessage
} & any

export const CsvImporterValidationPopup = (props: CsvImporterValidationPopupProps) => {
    const { validationMessage } = props
    const { messages, row, col } = validationMessage
    const [box, setBox] = useState<any>({})
    const { bottom, left } = box
    const {
        options: {
            text: { back, next },
        },
    } = useContext(CsvImporterContext)

    useEffect(() => {
        const cell = `c-${row}-${col}`
        setBox(getBoundingClientRect(documentObject.querySelectorAll(`[data-id='${cell}']`)[0]))
    }, [row, col])

    return (
        <Portal>
            <If if={!!bottom}>
                <div
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                    style={{ top: bottom, left }}
                    className="f-csv-importer-validation f-col">
                    {messages.map((message, index) => (
                        <div
                            className="f-row"
                            key={index}
                            style={{ gap: 5, width: '100%', justifyContent: 'flex-start' }}>
                            <IconLib
                                icon="arrow-right"
                                size="sm"
                            />
                            <Text>{message}</Text>
                        </div>
                    ))}
                    {/* 
                    {totalValidationMessages > 1 && (
                        <div
                            className="f-row"
                            style={{ width: '100%', marginTop: '1rem' }}>
                            <Button
                                size="sm"
                                disabled={!validationIndex}
                                onClick={onPrevious}>
                                {back}
                            </Button>
                            <div className="f-flexer" />
                            <Button
                                size="sm"
                                disabled={totalValidationMessages == validationIndex + 1}
                                onClick={onNext}>
                                {next}
                            </Button>
                        </div>
                    )}
                    */}
                </div>
            </If>
        </Portal>
    )
}
