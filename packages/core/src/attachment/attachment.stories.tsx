import { Attachment, AttachmentThumb, IconLib, Text, View } from '@fold-dev/core'
import React from 'react'

export default {
    title: 'Components/Attachment',
    component: Attachment,
    excludeStories: 'docs',
}

export const docs = {
    title: 'Attachment',
    subtitle: 'The Attachment component displays a file attachment that has been uploaded by a user or the system.',
    description:
        'The Attachment component is useful for displaying file attachments in message or file-based user interfaces, where it is necessary to represent MIME properties (file sizes, file types, etc.).',
}

export const Usage = () => {
    return (
        <Attachment
            as="a"
            width={500}
            heroPoster="/photos/10.jpg"
            mime="image/png"
            filesize={24325}
            label="filename.png"
            poster=""
            href="https://fold.dev"
            tools={
                <View
                    row
                    gap={10}
                    p="0 0.5rem"
                    color="var(--f-color-base-300)">
                    <IconLib icon="eye" />
                    <IconLib icon="bin" />
                </View>
            }
        />
    )
}

// --

/**
 * The hero poster provides a useful method to overlay interactive content related to the attachment. This can include (but not limited to) videos & embeddable maps.
 */
export const HeroPosterOverlay = () => {
    return (
        <Attachment
            width={500}
            heroPoster="/photos/04.jpg"
            heroPosterContent={
                <View
                    row
                    position="absolute"
                    width="100%"
                    height="100%"
                    bgToken="surface-inverse"
                    zIndex={1}
                    radius="var(--f-radius)"
                    style={{ top: 0, left: 0 }}>
                    <Text colorToken="text-on-color">Not available in your region.</Text>
                </View>
            }
            mime="image/png"
            filesize={24325}
            label="filename.png"
            poster=""
            href="https://fold.dev"
            tools={
                <View
                    row
                    gap={10}
                    p="0 0.5rem"
                    color="var(--f-color-base-300)">
                    <IconLib icon="eye" />
                    <IconLib icon="bin" />
                </View>
            }
        />
    )
}

// --

/**
 * Incomplete information & error states.
 */
export const States = () => (
    <View
        column
        gap={10}
        width={500}>
        <Attachment
            width={500}
            mime="image/png"
            filesize={24325}
            label="filename.png"
            href="https://fold.dev"
        />
        <Attachment
            width={500}
            poster="/photos/01.jpg"
            mime="image/png"
            filesize={24325}
            label="filename.png"
            loading
            loadingProgress={56}
            href="https://fold.dev"
        />
        <Attachment
            error
            mime="image/png"
            width={500}
            filesize={24325}
            label="filename.png"
            href="https://fold.dev"
        />
        <Attachment
            width={500}
            poster="/photos/01.jpg"
            mime="image/png"
            filesize={24325}
            label="filename.png"
            href="https://fold.dev"
        />
    </View>
)

// --

/**
 * Size variations, include `sm`, `md`, `lg`.
 */
export const Size = () => (
    <View
        column
        gap={10}>
        <Attachment
            size="sm"
            mime="image/png"
            filesize={24325}
            label="filename.png"
            href="https://fold.dev"
        />
        <Attachment
            mime="image/png"
            filesize={24325}
            label="filename.png"
            href="https://fold.dev"
        />
        <Attachment
            size="lg"
            mime="image/png"
            filesize={24325}
            label="filename.png"
            href="https://fold.dev"
        />
    </View>
)

// --

/**
 * The thumbnail variant of the Attachment component provides a small, more compact version. This can be useful in environment where space is limited, such as inline messages.
 */
export const Thumbnail = () => (
    <View
        row
        gap={10}
        justifyContent="flex-start">
        <AttachmentThumb
            poster="/photos/09.jpg"
            mime="image/png"
            label="filename.png"
            loading
            href="https://fold.dev"
        />
        <AttachmentThumb
            poster="/photos/10.jpg"
            mime="image/png"
            label="filename.png"
            loading
            loadingProgress={56}
            href="https://fold.dev"
        />
        <AttachmentThumb
            error
            filesize={24325}
            loadingProgress={45}
            mime="image/png"
            label="filename.png"
            href="https://fold.dev"
        />
        <AttachmentThumb
            mime="image/png"
            label="filename.png"
            href="https://fold.dev"
            tools={
                <View
                    row
                    gap={10}
                    p="0 0.5rem"
                    colorToken="accent-200"
                    zIndex={10}>
                    <IconLib icon="eye" />
                    <IconLib icon="bin" />
                </View>
            }
        />
        <AttachmentThumb
            poster="/photos/01.jpg"
            mime="image/png"
            label="filename.png"
            href="https://fold.dev"
            tools={
                <View
                    row
                    gap={10}
                    p="0 0.5rem"
                    colorToken="accent-200"
                    zIndex={10}>
                    <IconLib icon="eye" />
                    <IconLib icon="bin" />
                </View>
            }
        />
    </View>
)
