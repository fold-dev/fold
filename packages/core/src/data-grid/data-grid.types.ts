import { FunctionComponent, ReactNode } from 'react'

export namespace DataGridTypes {
    export type Column = {
        index?: number
        id: string
        label: string
        disabled?: boolean
        menu?: boolean
        align?: 'left' | 'right' | 'center'
        prefix?: ReactNode
        suffix?: ReactNode
        sortOrder?: 'ASC' | 'DESC'
        sortFunction?: (index: number) => (a, b) => number
        component?: FunctionComponent
        sticky?: boolean
        onClick?: (value) => void
        onWidthChange?: (value) => void
        disableWidthChange?: boolean
        disableDrag?: boolean
    }

    export type Cell = {
        value?: string | number
        id?: string
        index?: number
        disabled?: boolean
        edit?: boolean
        sticky?: boolean
        color?: string
        icon?: string
        options?: any
        disableSelect?: boolean
        disableEdit?: boolean
        component?: FunctionComponent
        selected?: boolean
        onSelect?: (value) => void
    }
}
