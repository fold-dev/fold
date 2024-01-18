import { IconLib, Label, Link, Stack, Text } from '@fold-dev/core'
import React from 'react'

export default {
    title: 'Components/Text',
    component: Text,
}

export const docs = {
    title: 'Text',
    subtitle: 'The Text component displays HTML text content with the ability to specify what type of tag to use.',
    description:
        'The Text component forms part of the Fold typography system. Please see the Design Token section for information about available options.',
}

export const Usage = () => <Text>Fold is a UI component library for product builders.</Text>

// --

export const Sizes = () => (
    <Stack
        direction="vertical"
        spacing={10}>
        <Text size="xs">This is extra small</Text>
        <Text size="sm">This is small</Text>
        <Text size="md">This is medium</Text>
        <Text size="lg">This is large</Text>
        <Text size="xl">This is very large</Text>
    </Stack>
)

// --

export const Variants = () => (
    <Stack
        direction="vertical"
        spacing={10}
        noStretch
        alignItems="flex-start">
        <Text as="b">Bold</Text>
        <Text as="i">Italic</Text>
        <Text as="u">Underlined</Text>
        <Text as="abbr">I18N</Text>
        <Text as="cite">Citation</Text>
        <Text as="del">Deleted</Text>
        <Text as="em">Emphasis</Text>
        <Text as="ins">Inserted</Text>
        <Text as="kbd">Keyboard</Text>
        <Text as="mark">Highlighted</Text>
        <Text as="s">Strikethrough</Text>
        <Text as="samp">Sample</Text>
        <Text as="sub">sub</Text>
        <Text as="sup">sup</Text>
        <Text as="code">code</Text>
        <Text as="small">small</Text>
        <Text as="small">small</Text>
        <Label>label</Label>
        <Link
            title="Fold"
            href="https://fold.dev"
            target="_blank">
            Link
        </Link>
        <Link
            title="Fold"
            href="https://fold.dev"
            target="_blank">
            <IconLib
                icon="paperclip"
                style={{ verticalAlign: 'top' }}
            />
            Link & icon
        </Link>
    </Stack>
)
