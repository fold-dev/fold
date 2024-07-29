import React, { createContext, useState } from 'react'
import { CsvImporterHeaderCell, CsvImporterMapping, CsvImporterOptions, CsvImporterSchema, defaultOptions } from '../'

export type CsvImporterContext = {
    schema: CsvImporterSchema[]
    separator: ',' | ';'
    options: CsvImporterOptions
    error: string | boolean
    setError: (content: string | boolean) => void
    fileData: string
    setFileData: (content: string) => void
    header: CsvImporterHeaderCell[]
    setHeader: (content: CsvImporterHeaderCell[]) => void
    records: any[][]
    setRecords: (content: any[][]) => void
    mapping: CsvImporterMapping
    setMapping: (content: CsvImporterMapping) => void
    sample: any[]
    setSample: (content: any[]) => void
}

export const CsvImporterContext = createContext<CsvImporterContext>({
    schema: [],
    separator: ',',
    options: {},
    error: null,
    setError: (content) => null,
    fileData: null,
    setFileData: (content) => null,
    header: [],
    setHeader: (content) => null,
    records: [],
    setRecords: (content) => null,
    mapping: [],
    setMapping: (content) => null,
    sample: [],
    setSample: (content) => null,
})

export const CsvImporterProvider = ({
    children,
    separator,
    schema = [],
    defaultMapping = {},
    defaultRecords = [],
    defaultHeader = [],
    defaultCsvData = '',
    options = defaultOptions,
}) => {
    const [error, setError] = useState<any>(null)
    const [header, setHeader] = useState<any>(defaultHeader)
    const [records, setRecords] = useState<any>(defaultRecords)
    const [sample, setSample] = useState<any>([])
    const [mapping, setMapping] = useState<any>(defaultMapping)
    const [fileData, setFileData] = useState<any>(defaultCsvData)

    return (
        <CsvImporterContext.Provider
            value={{
                separator,
                options,
                schema,
                error,
                setError,
                fileData,
                setFileData,
                header,
                setHeader,
                records,
                setRecords,
                mapping,
                setMapping,
                sample,
                setSample,
            }}>
            {children}
        </CsvImporterContext.Provider>
    )
}
