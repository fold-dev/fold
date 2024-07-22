import { CommonProps, View } from '../'
import React from 'react'

export type DataGridDefaultCellComponentProps = {} & CommonProps

export const DataGridDefaultCellComponent = (props: DataGridDefaultCellComponentProps) => (
    <View
        row
        width="100%"
        height="100%">
        {props.children}
    </View>
)
