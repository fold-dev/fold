import React, { useContext, useMemo, useState } from 'react'
import { CsvImporterContext, Upload } from '../'

export type CsvImporterUploadProps = {}

export const CsvImporterUpload = (props: CsvImporterUploadProps) => {
    const {
        setError,
        fileData,
        setFileData,
        options: {
            text: {
                upload: { before, after },
            },
        },
    } = useContext(CsvImporterContext)
    const [loading, setLoading] = useState(false)
    const { icon, title, description } = useMemo(() => {
        return {
            icon: fileData ? 'check' : 'paperclip',
            title: fileData ? after.title : before.title,
            description: fileData ? after.description : before.description,
        }
    }, [fileData])

    const handleDrop = (files) => {
        setLoading(true)
        const file = files[0]
        const reader = new FileReader()

        reader.onload = (e: any) => {
            setFileData(e.target.result)
            setLoading(false)
        }

        reader.onerror = (e) => {
            setError(true)
            setLoading(false)
        }

        reader.readAsText(file)
    }

    return (
        <Upload
            position="relative"
            zIndex={10000}
            height={500}
            loading={loading}
            icon={icon}
            title={title}
            description={description}
            onDrop={handleDrop}
        />
    )
}
