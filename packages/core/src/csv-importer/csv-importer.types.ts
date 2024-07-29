export type CsvImporterSchema = {
    key: string
    label: string
    type?: string
    validate?: (value) => string[]
    transform?: (value) => void
}

export type CsvImporterSchemaValidationMessage = {
    messages: string[]
    row: number
    col: number
}

export type CsvImporterOptions = {
    text?: {
        back: string
        next: string
        finish: string
        dialog: {
            title: string
            description: string
            cancel: string
            confirm: string
        }
        header: {
            row: string
            rows: string
        }
        toolbar: {
            row: string
            rows: string
            delete: string
        }
        complete: {
            title: string
            description: string
        }
        steps: {
            one: {
                title: string
                description: string
            }
            two: {
                title: string
                description: string
            }
            three: {
                title: string
                description: string
            }
            four: {
                title: string
                description: string
            }
        }
        map: {
            data: string
            sample: string
            schema: string
        }
        upload: {
            before: {
                title: string
                description: string
            }
            after: {
                title: string
                description: string
            }
        }
    }
}

export const defaultOptions: CsvImporterOptions = {
    text: {
        back: 'Back',
        next: 'Next',
        finish: 'Finish',
        dialog: {
            title: 'Are you sure?',
            description: 'This cannot be undone & you will lose the rows. Sure you want to continue?',
            cancel: 'Cancel',
            confirm: 'Delete',
        },
        header: {
            row: 'record found',
            rows: 'records found',
        },
        toolbar: {
            row: 'row selected',
            rows: 'rows selected',
            delete: 'Delete?',
        },
        complete: {
            title: 'Completed',
            description: 'Thank you so much, we have processed your file.',
        },
        steps: {
            one: {
                title: 'Source',
                description: 'Select a file',
            },
            two: {
                title: 'Headers',
                description: 'Select headers',
            },
            three: {
                title: 'Mapping',
                description: 'Map columns',
            },
            four: {
                title: 'Review',
                description: 'Clean data',
            },
        },
        map: {
            data: 'Data Column',
            sample: 'Data Sample',
            schema: 'Target Schema Column',
        },
        upload: {
            before: {
                title: 'Upload File',
                description: 'Click or drop your files here to begin your upload.',
            },
            after: {
                title: 'Uploaded',
                description: 'File contents retreived successfully - click next to continue!',
            },
        },
    },
}

export type CsvImporterHeaderCell = { value: string } & any

export type CsvImporterMapping = { [n: number]: string }
