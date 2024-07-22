import React, { ReactElement, ReactNode, createContext, useState } from 'react'

export type DateRangeSelection = Date

export type PendingRowSelection = Date[]

export type DatePickerProviderProps = {
    children: ReactNode
}

export const DatePickerContext = createContext<any>({})

export const DatePickerProvider = (props: DatePickerProviderProps) => {
    const [dateRangeSelection, setDateRangeSelection] = useState<DateRangeSelection>(new Date())
    const [pendingRowSelection, setPendingRowSelection] = useState<PendingRowSelection>([new Date(), new Date()])

    return (
        <DatePickerContext.Provider
            value={{
                dateRangeSelection,
                setDateRangeSelection,
                pendingRowSelection,
                setPendingRowSelection,
            }}>
            {props.children}
        </DatePickerContext.Provider>
    )
}
