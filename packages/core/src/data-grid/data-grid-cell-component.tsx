import {
    IconLib,
    Text,
    addAlpha,
    classNames,
    cleanObject,
    getForegroundColor,
    getKey,
    shadeColor,
} from '../'
import React, { useEffect, useMemo, useRef, useState } from 'react'

export type DataGridCellComponentProps = {
    value: string | number
    options?: any
    icon?: string
    color?: string
    edit?: boolean
    onEdit: (value) => void
    onCancel: () => void
}

export const DataGridCellComponent = (props: DataGridCellComponentProps) => {
    const { value, options = {}, icon, color, edit, onEdit, onCancel } = props
    const ref = useRef(null)
    const inputRef = useRef(null)
    const [text, setText] = useState(value)
    const styles = useMemo(() => {
        const foregroundColor = color ? color : null
        const backgroundColor = color ? addAlpha(color, 0.1) : null
        return cleanObject({
            color: foregroundColor,
            backgroundColor,
        })
    }, [color])
    const className = classNames({
        'f-data-grid-cell-component': true,
        'f-row': true,
        'is-edit': edit,
        'is-color': !!color,
    })

    const handleKeyDown = (e: any) => {
        const { isEnter, isEscape } = getKey(e)
        if (isEnter) onEdit(text)
        if (isEscape) onCancel()
    }

    useEffect(() => {
        setText(value)
    }, [value])

    useEffect(() => {
        inputRef.current.select()
    }, [edit])

    return (
        <div
            style={styles}
            ref={ref}
            className={className}>
            {!edit && (
                <>
                    <Text
                        as="span"
                        className="f-ellipsis f-flexer">
                        {value}
                    </Text>

                    {!!icon && (
                        <IconLib
                            size="sm"
                            icon={icon}
                        />
                    )}
                </>
            )}

            <input
                ref={inputRef}
                style={{ display: edit ? 'block' : 'none' }}
                type="text"
                value={text}
                onBlur={() => onEdit(text)}
                onKeyDown={handleKeyDown}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    )
}
