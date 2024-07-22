import { CommonProps, ContextMenuContext, classNames, getKey, waitForRender } from '@fold-dev/core'
import React, { FunctionComponent, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DataGridCellComponent, DataGridContext, dispatchDataGridEvent, stopEvent } from '../'

export type DataGridCellProps = {
    value?: string | number
    id: string
    index: number
    disabled?: boolean
    edit?: boolean
    color?: string
    icon?: string
    options?: any
    disableSelect?: boolean
    disableEdit?: boolean
    component: FunctionComponent
    selected?: boolean
    onSelect: (value) => void
} & CommonProps

export const DataGridCell = (props: DataGridCellProps) => {
    const { id, index, disabled, color, icon, options, component = DataGridCellComponent, selected, onSelect } = props
    const disableSelect = props.disableSelect || disabled
    const disableEdit = props.disableEdit || disabled
    const ref = useRef(null)
    const { setMenu } = useContext(ContextMenuContext)
    const { dragCol, setCellSelection, instanceId, columnTypes } = useContext(DataGridContext)
    const Component: any = columnTypes ? columnTypes[index - 1] || component : component // -1 to compensate for gutter
    const [value, setValue] = useState<any>(props.value)
    const [edit, setEdit] = useState(!!props.edit)
    const cache = useRef(null)
    const className = classNames({
        'f-data-grid-cell': true,
        'is-disabled': disabled,
        'is-selected': selected && !disableSelect,
        'is-col-dragged': index == dragCol,
    })

    const refocus = () => {
        // focus will return to the grid container
        // so we put it back here
        waitForRender(() => ref.current?.focus())
    }

    const editCell = () => {
        if (!disableEdit) {
            setEdit(true)
            cache.current = value
        }
    }

    const handleKeyDown = (e) => {
        const { isEnter, isSpace, isBackspace, isEscape, isRight, isLeft, isUp, isDown, isShift } = getKey(e)
        const isDirection = isRight || isLeft || isUp || isDown
        const [_, row, col] = id.split('-')

        if (selected) {
            if (isEnter) {
                if (edit) {
                    setEdit(false)
                    refocus()
                } else {
                    stopEvent(e)
                    editCell()
                }
            } else if (isSpace) {
                if (!edit) {
                    stopEvent(e)
                    editCell()
                }
            } else if (isBackspace) {
                // we wait for state here rather
                // TODO: optimistic update?
                // setEdit(false)
                // setValue('')
                dispatchDataGridEvent('delete-cell', { instanceId, row: +row, col: +col })
            } else if (isEscape) {
                setEdit(false)
                refocus()
            } else if (isDirection) {
                // TODO: directional selection
                // if (edit) stopEvent(e)
            } else if (isShift) {
                // TODO: shift/multi selection
            } else {
                editCell()
            }
        }
    }

    const handleClick = (e) => {
        if (!disableSelect) {
            onSelect({ [id]: true })
        }
    }

    const handleBlur = (e) => {
        // TODO: should this deselect?
        // setCellSelection({})
        // setEdit(false)
        // setValue(value)
    }

    const handleDoubleClick = (e) => {
        editCell()
    }

    const handleCancel = (e) => {
        refocus()
        setEdit(false)
        setValue(cache.current)
    }

    const handleEdit = (value) => {
        const [_, row, col] = id.split('-')
        setEdit(false)
        refocus()
        // NB: This is an optimistic update
        setValue(value)
        dispatchDataGridEvent('update-cell', { instanceId, value, row: +row, col: +col })
    }

    const handleContextMenuClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setMenu({ target: 'grid-cell', payload: props }, { x: e.clientX, y: e.clientY })
    }

    useEffect(() => {
        if (selected) refocus()
    }, [selected])

    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    useLayoutEffect(() => {
        const el: any = ref.current
        if (el) el.addEventListener('contextmenu', handleContextMenuClick)
        return () => el.removeEventListener('contextmenu', handleContextMenuClick)
    })

    return (
        <div
            ref={ref}
            tabIndex={0}
            className={className}
            data-id={id}
            data-col={index}
            onBlur={handleBlur}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleDoubleClick}>
            <Component
                id={id}
                edit={!disableEdit && edit}
                value={value}
                options={options}
                color={color}
                icon={icon}
                onEdit={handleEdit}
                onCancel={handleCancel}>
                {props.children}
            </Component>
        </div>
    )
}
