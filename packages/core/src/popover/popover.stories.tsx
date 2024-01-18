import {
    Avatar,
    Button,
    ButtonGroup,
    Flexer,
    Heading,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    Popover,
    Text,
    useVisibility,
    View,
} from '@fold-dev/core'
import React, { useRef } from 'react'

export default {
    title: 'Components/Popover',
    component: Popover,
}

export const docs = {
    title: 'Popover',
    subtitle: 'The Popover component is an overlay that opens on top of all other content on the page.',
    description:
        'A Popover component serves as a valuable tool for presenting in-depth information within a pop-up box that is positioned in proximity to the element being clicked or hovered. Popover components have many uses, but are particularly useful for adding context to particular pieces of content, such use quick-view information, form input & warning or failure details.',
}

export const Usage = () => {
    const { visible, show, hide } = useVisibility(true)

    return (
        <Popover
            arrow
            width={300}
            anchor="middle-right"
            content={
                <View
                    p={20}
                    column
                    gap={10}
                    alignItems="flex-start">
                    <Heading as="h4">Craig Pather</Heading>
                    <Heading as="h5">CTO Acme Corp</Heading>
                    <Text>
                        Leading the engineering division at Acme corp, Craig has delivered on numerous deadlines.
                    </Text>
                    <ButtonGroup>
                        <Button>Send Mail</Button>
                        <Button>Add Contact</Button>
                    </ButtonGroup>
                </View>
            }
            isVisible={visible}
            onDismiss={hide}>
            <Avatar
                onClick={show}
                name="Craig Pather"
                src="/men/01.jpg"
            />
        </Popover>
    )
}

// --

export const Positions = () => {
    const { visible, show, hide } = useVisibility(true)

    return (
        <View m="0 0 0 300px">
            <Popover
                anchor="middle-left"
                width={300}
                content={<Text p={20}>Middle left</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="middle-left"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={25} />
            <Popover
                anchor="middle-right"
                width={400}
                content={<Text p={20}>Middle right</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="middle-right"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                anchor="top-center"
                width={300}
                content={<Text p={20}>Top center</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="top-center"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={25} />
            <Popover
                anchor="bottom-center"
                width={400}
                content={<Text p={20}>Bottom center</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="bottom-center"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                anchor="bottom-left"
                width={300}
                content={<Text p={20}>Bottom left</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="bottom-left"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                anchor="bottom-right"
                width={400}
                content={<Text p={20}>Bottom right</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="bottom-right"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={125} />
            <Popover
                anchor="top-left"
                width={400}
                content={<Text p={20}>Top left</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="top-left"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                anchor="top-right"
                width={400}
                content={<Text p={20}>Top right</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="top-right"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
        </View>
    )
}

// --

export const PositionsWithArrows = () => {
    const { visible, show, hide } = useVisibility(true)

    return (
        <View m="0 0 0 300px">
            <Popover
                arrow
                anchor="middle-left"
                width={300}
                content={<Text p={20}>Middle left</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="middle-left"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={25} />
            <Popover
                arrow
                anchor="middle-right"
                width={400}
                content={<Text p={20}>Middle right</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="middle-right"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                arrow
                anchor="top-center"
                width={300}
                content={<Text p={20}>Top center</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="top-center"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={25} />
            <Popover
                arrow
                anchor="bottom-center"
                width={400}
                content={<Text p={20}>Bottom center</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="bottom-center"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                arrow
                anchor="bottom-left"
                width={300}
                content={<Text p={20}>Bottom left</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="bottom-left"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                arrow
                anchor="bottom-right"
                width={400}
                content={<Text p={20}>Bottom right</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="bottom-right"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={125} />
            <Popover
                arrow
                anchor="top-left"
                width={400}
                content={<Text p={20}>Top left</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="top-left"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
            <View height={75} />
            <Popover
                arrow
                anchor="top-right"
                width={400}
                content={<Text p={20}>Top right</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="top-right"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
        </View>
    )
}

// --

export const FocusTrapWithChildWidth = () => {
    const { visible, show, hide } = useVisibility(true)
    const ref1 = useRef(null)
    const ref2 = useRef(null)

    return (
        <Popover
            anchor="bottom-right"
            content={<Text p={20}>Fixed to the width of the container & only blurring will dismiss this.</Text>}
            isVisible={visible}
            onDismiss={(e) => {
                switch (e.target) {
                    case ref1.current:
                        return console.log('main input')
                    case ref2.current:
                        return console.log('popup content input')
                    default:
                        hide()
                }
            }}>
            <Input
                onFocus={show}
                value={visible ? 'Popover is visible' : 'Popover is not visible'}
                ref={ref1}
                onChange={(e) => null}
            />
        </Popover>
    )
}

// --

export const Anchor = () => {
    const { visible, show, hide } = useVisibility(true)

    return (
        <View position="relative">
            <Popover
                width={400}
                anchor="bottom-left"
                fixPosition={{ top: 200, left: 200 }}
                content={<Text p={20}>This popover is fixed at 200px down & 200px left.</Text>}
                isVisible={visible}
                onDismiss={hide}>
                <Button
                    id="bottom-right"
                    onClick={show}>
                    Show Popover
                </Button>
            </Popover>
        </View>
    )
}

// --

export const OffscreenDetection = () => {
    const { visible, show, hide } = useVisibility(false)

    return (
        <View>
            <View row>
                <Popover
                    arrow
                    width="fit-content"
                    isVisible={visible}
                    onDismiss={hide}
                    content={
                        <View
                            width={300}
                            height={200}>
                            <Text p={20}>This will open to the right</Text>
                        </View>
                    }>
                    <Button onClick={show}>Show Popover</Button>
                </Popover>
                <Flexer />
                <Popover
                    arrow
                    width="fit-content"
                    isVisible={visible}
                    onDismiss={hide}
                    content={
                        <View
                            width={300}
                            height={200}>
                            <Text p={20}>This will open to the left</Text>
                        </View>
                    }>
                    <Button onClick={show}>Show Popover</Button>
                </Popover>
            </View>
            <br />
            <MenuButton
                menu={({ dismiss }) => (
                    <Menu width={200}>
                        <MenuItem>File</MenuItem>
                        <MenuItem>Edit</MenuItem>
                        <MenuItem>Copy</MenuItem>
                        <MenuItem>Paste</MenuItem>
                        <MenuItem>Cut</MenuItem>
                        <MenuItem>Select</MenuItem>
                        <MenuItem>Settings</MenuItem>
                        <MenuItem>Print</MenuItem>
                        <MenuItem>Export</MenuItem>
                        <MenuItem>Save</MenuItem>
                        <MenuItem>Exit</MenuItem>
                    </Menu>
                )}>
                Open Menu
            </MenuButton>
        </View>
    )
}
