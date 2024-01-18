import React from 'react'
import { CoreViewProps } from '../types'
import { classNames, cleanObject } from '../helpers'
import { View } from '../view/view'

export type GridProps = {
    autoColumns?: string
    autoFlow?: string
    autoRows?: string
    column?: string | number
    columns?: number
    minChildWidth?: number | string
    row?: string | number
    templateAreas?: string
    templateColumns?: string
    templateRows?: string
    gap?: string | number
    grid?: string
} & CoreViewProps

export const Grid = (props: GridProps) => {
    const {
        style = {},
        autoColumns,
        autoFlow,
        autoRows,
        column,
        columns,
        minChildWidth,
        row,
        templateAreas,
        templateColumns,
        templateRows,
        gap,
        grid,
        ...rest
    } = props
    const className = classNames(
        {
            'f-grid': true,
        },
        [props.className]
    )
    const gridTemplateColumns = columns ? `repeat(${columns}, minmax(${minChildWidth || 0}px, 1fr))` : templateColumns
    const styles = cleanObject({
        ...style,
        gridAutoColumns: autoColumns,
        gridAutoFlow: autoFlow,
        gridAutoRows: autoRows,
        gridColumn: column,
        gridRow: row,
        gridTemplateAreas: templateAreas,
        gridTemplateColumns,
        gridTemplateRows: templateRows,
        gridGap: gap,
        grid: grid,
    })

    return (
        <View
            {...rest}
            style={styles}
            className={className}
        />
    )
}

export type GridItemProps = {
    area?: string
    colEnd?: number | 'auto'
    colSpan?: number | 'auto'
    colStart?: number | 'auto'
    rowEnd?: number | 'auto'
    rowSpan?: number | 'auto'
    rowStart?: number | 'auto'
} & CoreViewProps

export const GridItem = (props: GridItemProps) => {
    const { style = {}, area, colEnd, colSpan, colStart, rowEnd, rowSpan, rowStart, ...rest } = props
    const className = classNames(
        {
            'f-grid-item': true,
        },
        [props.className]
    )
    const styles = cleanObject({
        ...style,
        gridArea: area,
        gridColumnEnd: colEnd,
        gridColumn: colSpan,
        gridColumnStart: colStart,
        gridRowEnd: rowEnd,
        gridRow: rowSpan,
        gridRowStart: rowStart,
    })

    return (
        <View
            {...rest}
            style={styles}
            className={className}
        />
    )
}
