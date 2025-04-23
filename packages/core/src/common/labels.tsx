import { IconLib, Pill } from '../'
import React from 'react'
import { LabelSelectLabel } from './label-select'

type LabelsLabel = {} & LabelSelectLabel

type LabelProps = {
    disabled?: boolean
    onClick: (e) => void
} & LabelsLabel

const Label = ({ id = null, icon = null, text, color, onClick, disabled }: LabelProps) => {
    return (
        <Pill
            style={{ pointerEvents: disabled ? 'none' : undefined }}
            tabIndex={0}
            className="f-label"
            color={color}
            subtle
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClick(e)
            }}
            prefix={
                icon ? (
                    <IconLib
                        icon={icon}
                        size="sm"
                    />
                ) : undefined
            }>
            {text}
        </Pill>
    )
}

export type LabelsProps = {
    disabled?: boolean
    labels: LabelsLabel[]
    onClick: (e) => void
}

export const Labels = ({ labels, disabled, onClick }: LabelsProps) => {
    if (labels.length == 0) return null

    return (
        <>
            {labels.map((label: any, index: number) => (
                <Label
                    disabled={disabled}
                    key={index}
                    id={label.id}
                    icon={label.icon}
                    text={label.text}
                    color={label.color}
                    onClick={onClick}
                />
            ))}
        </>
    )
}
