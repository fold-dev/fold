import { IconLib, ProgressCircle } from '../'
import React from 'react'

export type BadgesAltBadge = {
    icon?: string
    color?: string
    progress?: number
    label?: string
}

export type BadgeAltProps = BadgesAltBadge

export const BadgeAlt = ({ icon, label, color, progress }: BadgeAltProps) => {
    return (
        <span
            className="f-row f-badges"
            style={{ color, gap: 4 }}>
            {icon && (
                <IconLib
                    icon={icon}
                    size="sm"
                />
            )}
            {progress && (
                <ProgressCircle
                    value={progress}
                    size={12}
                    thickness={28}
                    style={{
                        '--f-progress-background': 'var(--f-color-surface-strong)',
                        '--f-progress-active': color || 'var(--f-color-surface-strongest)',
                    }}
                />
            )}
            {label && (
                <span
                    className="f-text sm"
                    style={{ color: 'inherit' }}>
                    {label}
                </span>
            )}
        </span>
    )
}
