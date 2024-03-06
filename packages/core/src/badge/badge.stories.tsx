import React from 'react'
import { Badge, View } from '@fold-dev/core'

export default {
    title: 'Components/Badge',
    component: Badge,
    excludeStories: 'docs',
}

export const docs = {
    title: 'Badge',
    subtitle: 'The Badge serves as a small label or indicator for UI elements.',
    description:
        'The Badge component is useful for conveying important information the user should be aware of, such as unread message counts, notifications, etc. It should be in close proximity to the relative element.',
}

export const Usage = () => (
    <View
        row
        gap={5}
        width="fit-content">
        <Badge>+34 notifications</Badge>
        <Badge outline>+12 outline notifications</Badge>
    </View>
)

// --

export const Variants = () => (
    <View
        row
        gap={5}
        width="fit-content">
        <Badge>default</Badge>
        <Badge variant="accent">accent</Badge>
        <Badge variant="success">success</Badge>
        <Badge variant="neutral">neutral</Badge>
        <Badge variant="caution">caution</Badge>
        <Badge variant="warning">warning</Badge>
        <Badge variant="danger">danger</Badge>
    </View>
)

// --

export const VariantsOutline = () => (
    <View
        row
        gap={5}
        width="fit-content">
        <Badge outline>default</Badge>
        <Badge
            variant="accent"
            outline>
            accent
        </Badge>
        <Badge
            variant="success"
            outline>
            success
        </Badge>
        <Badge
            variant="neutral"
            outline>
            neutral
        </Badge>
        <Badge
            variant="caution"
            outline>
            caution
        </Badge>
        <Badge
            variant="warning"
            outline>
            warning
        </Badge>
        <Badge
            variant="danger"
            outline>
            danger
        </Badge>
    </View>
)

// --

export const Sizes = () => (
    <View
        row
        gap={5}
        width="fit-content">
        <Badge size="xs">extra small</Badge>
        <Badge size="sm">small</Badge>
        <Badge size="md">medium</Badge>
        <Badge size="lg">large</Badge>
        <Badge size="xl">extra large</Badge>
    </View>
)

// --

/**
 * When the Badge component has no children, it reverts to becoming an indicator.
 */
export const Indicator = () => (
    <View
        row
        gap={5}
        width="fit-content">
        <Badge
            variant="success"
            size="xs"
        />
        <Badge
            variant="success"
            size="sm"
        />
        <Badge
            variant="success"
            size="md"
        />
        <Badge
            variant="success"
            size="lg"
        />
        <Badge
            variant="success"
            size="xl"
        />
    </View>
)

// --

export const Position = () => (
    <View
        width={100}
        height={100}
        bgToken="surface-strong"
        position="relative">
        <Badge
            variant="accent"
            anchor="top-left"
        />
        <Badge
            variant="success"
            anchor="top-right"
        />
        <Badge
            variant="neutral"
            anchor="bottom-left"
        />
        <Badge
            variant="warning"
            anchor="bottom-right"
        />
    </View>
)
