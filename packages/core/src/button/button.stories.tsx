import {
    Button,
    ButtonGroup,
    DarkModeButton,
    Heading,
    IconButton,
    IconLib,
    Menu,
    MenuItem,
    Popover,
    Stack,
    View,
    useVisibility,
} from '@fold-dev/core'
import React from 'react'

export default {
    title: 'Components/Button',
    component: Button,
    excludeStories: 'docs',
}

export const docs = {
    title: 'Button',
    subtitle: 'The Button component enables users to perform actions, make selections, and submit forms.',
    description:
        'Buttons serve as fundamental elements in user interfaces and are frequently integrated within encapsulated elements such as cards and dialogs, establishing a contextual connection with the specific component they are placed within.',
}

export const Usage = () => <Button>Okay</Button>

// --

export const Sizes = () => (
    <Stack spacing={5}>
        <Button size="xs">Xsmall</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Xlarge</Button>
    </Stack>
)

// --

export const Variants = () => (
    <View column gap="1rem" alignItems="flex-start">
        <Heading as="h5">Normal</Heading>
        <Stack spacing={5}>
            <Button>Default</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="success">Success</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="caution">Caution</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="highlight">Highlight</Button>
        </Stack>
        <Heading as="h5">Disabled</Heading>
        <Stack spacing={5}>
            <Button disabled>Default</Button>
            <Button disabled variant="accent">Accent</Button>
            <Button disabled variant="success">Success</Button>
            <Button disabled variant="neutral">Neutral</Button>
            <Button disabled variant="caution">Caution</Button>
            <Button disabled variant="warning">Warning</Button>
            <Button disabled variant="danger">Danger</Button>
            <Button disabled variant="highlight">Highlight</Button>
        </Stack>
        <Heading as="h5">Loading</Heading>
        <Stack spacing={5}>
            <Button loading>Default</Button>
            <Button loading variant="accent">Accent</Button>
            <Button loading variant="success">Success</Button>
            <Button loading variant="neutral">Neutral</Button>
            <Button loading variant="caution">Caution</Button>
            <Button loading variant="warning">Warning</Button>
            <Button loading variant="danger">Danger</Button>
            <Button loading variant="highlight">Highlight</Button>
        </Stack>
        <Heading as="h5">Active</Heading>
        <Stack spacing={5}>
            <Button active>Default</Button>
            <Button active variant="accent">Accent</Button>
            <Button active variant="success">Success</Button>
            <Button active variant="neutral">Neutral</Button>
            <Button active variant="caution">Caution</Button>
            <Button active variant="warning">Warning</Button>
            <Button active variant="danger">Danger</Button>
            <Button active variant="highlight">Highlight</Button>
        </Stack>
    </View>
)

// --

export const Subtle = () => (
    <Stack spacing={5}>
        <Button subtle>Default</Button>
        <Button
            variant="accent"
            subtle>
            Accent
        </Button>
        <Button
            variant="success"
            subtle>
            Success
        </Button>
        <Button
            variant="neutral"
            subtle>
            Neutral
        </Button>
        <Button
            variant="caution"
            subtle>
            Caution
        </Button>
        <Button
            variant="warning"
            subtle>
            Warning
        </Button>
        <Button
            variant="danger"
            subtle>
            Danger
        </Button>
        <Button
            variant="highlight"
            subtle>
            Highlight
        </Button>
    </Stack>
)

// --

export const Outline = () => (
    <Stack spacing={5}>
        <Button outline>Default</Button>
        <Button
            variant="accent"
            outline>
            Accent
        </Button>
        <Button
            variant="success"
            outline>
            Success
        </Button>
        <Button
            variant="neutral"
            outline>
            Neutral
        </Button>
        <Button
            variant="caution"
            outline>
            Caution
        </Button>
        <Button
            variant="warning"
            outline>
            Warning
        </Button>
        <Button
            variant="danger"
            outline>
            Danger
        </Button>
        <Button
            variant="highlight"
            outline>
            Highlight
        </Button>
    </Stack>
)

// --

export const WithPrefixAndSuffix = () => (
    <Stack spacing={5}>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            prefix={<IconLib icon="circle" />}>
            With Prefix
        </Button>
        <Button
            outline
            variant="accent"
            suffix={<IconLib icon="circle" />}>
            With Suffix
        </Button>
        <Button
            subtle
            variant="danger"
            prefix={<IconLib icon="circle" />}
            suffix={<IconLib icon="circle" />}>
            With Prefix & Suffix
        </Button>
    </Stack>
)

// --

/**
 * Sometimes you need the text of the button to wrap. For this, the Button component offers the handy `ellipsis` prop.
 */
export const EllipsisMode = () => (
    <Button
        prefix={<IconLib icon="circle" />}
        width={150}
        ellipsis>
        This is some really long text!
    </Button>
)

// --

export const States = () => (
    <Stack spacing={5}>
        <Button
            variant="success"
            loading>
            Loading
        </Button>
        <Button
            disabled
            subtle>
            Default
        </Button>
        <Button
            variant="accent"
            disabled
            subtle>
            Accent
        </Button>
        <Button
            variant="success"
            disabled>
            Success
        </Button>
        <Button
            variant="neutral"
            disabled
            subtle>
            Neutral
        </Button>
        <Button
            variant="accent"
            active>
            Active
        </Button>
        <Button
            variant="warning"
            disabled>
            Warning
        </Button>
        <Button
            variant="danger"
            disabled
            outline
            subtle>
            Danger
        </Button>
        <Button
            variant="highlight"
            disabled>
            Highlight
        </Button>
    </Stack>
)

// --

export const AsLink = () => (
    <Stack spacing={5}>
        <Button
            as="a"
            href="https://google.com"
            target="_blank">
            Default
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            subtle
            underlined>
            Subtle
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            variant="accent"
            subtle
            underlined>
            Accent
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            variant="success"
            subtle
            underlined>
            Success
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            variant="neutral"
            subtle>
            Neutral
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            variant="caution"
            outline>
            Caution
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            variant="warning"
            outline>
            Warning
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            variant="danger">
            Danger
        </Button>
        <Button
            as="a"
            href="https://google.com"
            target="_blank"
            variant="highlight"
            underlined>
            Highlight
        </Button>
    </Stack>
)

// --

export const WithIcon = () => (
    <Stack spacing={5}>
        <IconButton
            icon="bin"
            size="xs"
            subtle
            variant="highlight"
        />
        <IconButton
            icon="bin"
            size="sm"
            outline
            variant="accent"
        />
        <IconButton
            icon="bin"
            size="md"
        />
        <IconButton
            icon="bin"
            size="lg"
        />
        <IconButton
            icon="bin"
            size="xl"
        />
    </Stack>
)

// --

export const ButtonGroups = () => (
    <Stack
        spacing={10}
        direction="vertical">
        <ButtonGroup>
            <Button>First</Button>
            <Button>Second</Button>
            <IconButton icon="bin" />
        </ButtonGroup>
        <ButtonGroup>
            <Button size="sm">First</Button>
            <Button size="sm">Second</Button>
            <Button size="sm">Third</Button>
            <Button size="sm">Fourth</Button>
        </ButtonGroup>
        <ButtonGroup width={300}>
            <Button>With</Button>
            <Button>Fixed</Button>
            <Button>Width</Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button>Normal Button</Button>
        </ButtonGroup>
        <ButtonGroup
            direction="vertical"
            width={300}>
            <Button>With</Button>
            <Button>Direction</Button>
            <Button>Going</Button>
            <Button>Vertical</Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button variant="accent" outline>Accented</Button>
            <Button variant="accent" outline>Accented</Button>
        </ButtonGroup>
        <ButtonGroup
            direction="vertical"
            width={300}>
            <Button variant="highlight" outline>With</Button>
            <Button variant="highlight" outline>Direction</Button>
            <Button variant="highlight" outline>Going</Button>
            <Button variant="highlight" outline>Vertical</Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button variant="accent">Accented 1</Button>
            <Button variant="accent">Accented 2</Button>
            <Button variant="accent">Accented 3</Button>
        </ButtonGroup>
        <ButtonGroup
            direction="vertical"
            width={300}>
            <Button variant="highlight">With</Button>
            <Button variant="highlight">Direction</Button>
            <Button variant="highlight">Going</Button>
            <Button variant="highlight">Vertical</Button>
        </ButtonGroup>
    </Stack>
)

// --

export const ButtonGroupMenu = () => {
    const { visible, show, hide } = useVisibility(false)

    return (
        <ButtonGroup>
            <Button>Select Action</Button>
            <Popover
                border="none"
                width="fit-content"
                anchor="bottom-right"
                isVisible={visible}
                onDismiss={hide}
                content={
                    <Menu width={200}>
                        <MenuItem>Copy</MenuItem>
                        <MenuItem>Paste</MenuItem>
                        <MenuItem>Delete</MenuItem>
                    </Menu>
                }>
                <Button onClick={show}>
                    <IconLib icon="chevron-down" />
                </Button>
            </Popover>
        </ButtonGroup>
    )
}

// --

/**
 * Fold includes a dark-mode button that automatically toggles between dark & light modes.
 */
export const DarkMode = () => <DarkModeButton />
