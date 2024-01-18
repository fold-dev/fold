import React, { useRef, useState } from 'react'
import { Heading, Progress, SpinnerOverlay, Text, View } from '../'
import { classNames } from '../helpers'
import { IconLib } from '../icon'
import { CoreViewProps } from '../types'

export type UploadProps = {
    inputProps?: any
    disabled?: boolean
    loadingProgress?: number
    title: string
    description: string
    loading?: boolean
    icon?: string
    onDrop: any
} & CoreViewProps

export const Upload = (props: UploadProps) => {
    const {
        inputProps = {},
        disabled,
        loadingProgress,
        title,
        description,
        loading,
        icon = 'upload',
        onDrop,
        ...rest
    } = props
    const [over, setOver] = useState(false)
    const isInactive = !!loading || !!disabled || !!loadingProgress
    const className = classNames({
        'f-upload': true,
        'f-col': true,
        'is-active': over,
        'is-disabled': disabled,
        'is-loading': loadingProgress || loading,
    })

    const handleDragOver = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if (isInactive) return
        setOver(true)
    }

    const handleDragStop = (e: any) => {
        setOver(false)
    }

    const handleChange = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if (isInactive) return
        onDrop(e.currentTarget.files)
    }

    const handleDrop = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if (isInactive) return
        setOver(false)
        onDrop(e.dataTransfer.files)
    }

    const handleClick = (e: any) => {
        if (isInactive) {
            e.stopPropagation()
            e.preventDefault()
        }
    }

    return (
        <View
            {...rest}
            as="label"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragEnd={handleDragStop}
            onDragLeave={handleDragStop}
            onDragExit={handleDragStop}
            onDrop={handleDrop}
            className={className}>
            <input
                {...inputProps}
                type="file"
                onChange={handleChange}
            />
            {loading && (
                <SpinnerOverlay
                    thickness={3}
                    size="lg"
                />
            )}
            <IconLib
                icon={icon}
                size="lg"
                style={{
                    width: 30,
                    height: 30,
                }}
            />
            <Heading>{title}</Heading>
            <Text>{description}</Text>
            {loadingProgress && <Progress value={loadingProgress} />}
        </View>
    )
}

export type UploadAreaProps = {
    onDrop: any
} & CoreViewProps

export const UploadArea = (props: any) => {
    const { onDrop, children, ...rest } = props
    const [over, setOver] = useState(false)

    const handleDragOver = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        setOver(true)
    }

    const handleDragStop = (e: any) => {
        setOver(false)
    }

    const handleDrop = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        setOver(false)
        onDrop(e.dataTransfer.files)
    }

    return (
        <View
            {...rest}
            onDragOver={handleDragOver}
            onDragEnd={handleDragStop}
            onDragLeave={handleDragStop}
            onDragExit={handleDragStop}
            onDrop={handleDrop}>
            {children(over)}
        </View>
    )
}

export type UploadCustomProps = {
    inputProps?: any
    onChange: any
    children: any
} & Omit<CoreViewProps, 'onChange' | 'children'>

export const UploadCustom = (props: UploadCustomProps) => {
    const { inputProps = {}, onChange, children, ...rest } = props
    const labelRef = useRef(null)
    const className = classNames(
        {
            'f-upload-custom': true,
        },
        [props.className]
    )

    return (
        <View
            {...rest}
            as="label"
            ref={labelRef}
            className={className}>
            <input
                {...inputProps}
                type="file"
                onChange={onChange}
            />
            {children(() => labelRef.current.click())}
        </View>
    )
}
