import * as Token from '@fold-dev/design/tokens'
import {
    Avatar,
    Divider,
    getKey,
    Heading,
    Icon,
    IconLib,
    LabelSelect,
    LabelSelectLabel,
    Pill,
    Select,
    SelectList,
    SelectOption,
    SelectOptionProps,
    Stack,
    Text,
    timezones,
    UserSelect,
    UserSelectUser,
    View,
} from '@fold-dev/core'
import React, { useMemo, useRef, useState } from 'react'

export default {
    title: 'Components/Select',
    component: Select,
    excludeStories: 'docs',
}

export const docs = {
    title: 'Select',
    subtitle: 'The Select component displays a list of options a user can select from.',
    description:
        'Select components are a common feature of almost every user experience on the web (and off) where the user is tasked to input data. The Fold Select component attempts to cover as many general use-case scenarios, as well as specialized, whilst keeping the interface performant and responsive.',
}

export const Usage = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <Select
            width={350}
            placeholder="Select a timezone"
            selected={selected}
            onSelect={handleSelect}
            options={timezones.map((tz) => ({
                key: tz,
                label: tz,
            }))}
        />
    )
}

// --

export const Sizes = () => {
    const [selected, setSelected] = useState<any>([])

    const options = timezones.map((tz) => ({
        key: tz,
        label: tz,
    }))

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <Stack
            direction="vertical"
            spacing={10}>
            <Select
                width={350}
                size="xs"
                placeholder="This is extra small"
                selected={selected}
                onSelect={handleSelect}
                options={options}
            />
            <Select
                width={350}
                size="sm"
                placeholder="This is small"
                selected={selected}
                onSelect={handleSelect}
                options={options}
            />
            <Select
                width={350}
                size="md"
                placeholder="This is medium"
                selected={selected}
                onSelect={handleSelect}
                options={options}
            />
            <Select
                width={350}
                size="lg"
                placeholder="This is large"
                selected={selected}
                onSelect={handleSelect}
                options={options}
            />
            <Select
                width={350}
                size="xl"
                placeholder="This is extra large"
                selected={selected}
                onSelect={handleSelect}
                options={options}
            />
        </Stack>
    )
}

// --

export const PrefixAndSuffix = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <Select
            width={350}
            prefix={<IconLib icon="time" />}
            suffix={<IconLib icon="chevron-down" />}
            placeholder="Select a timezone"
            selected={selected}
            onSelect={handleSelect}
            options={timezones.map((tz) => ({
                key: tz,
                label: tz,
            }))}
        />
    )
}

// --

export const AlwaysOpen = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <Select
            prefix={<IconLib icon="time" />}
            suffix={<IconLib icon="chevron-down" />}
            width={350}
            variant="static"
            placeholder="Select a timezone"
            selected={selected}
            onSelect={handleSelect}
            options={timezones.map((tz) => ({
                key: tz,
                label: tz,
            }))}
        />
    )
}

// --

export const States = () => {
    const [selected, setSelected] = useState<any>([])

    const options = timezones.map((tz) => ({
        key: tz,
        label: tz,
    }))

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <Stack
            direction="vertical"
            spacing={10}>
            <Heading as="h4">Disabled</Heading>
            <Select
                width={350}
                disabled
                placeholder="This is disabled"
                selected={selected}
                onSelect={handleSelect}
                options={options}
            />
            <Heading as="h4">Read only & dismiss on click</Heading>
            <Select
                width={350}
                as="default"
                size="md"
                placeholder="Select a timezone!!!"
                disabled={false}
                readOnly
                selected={selected}
                options={options}
                header={<Text p={16}>Header</Text>}
                footer={<Text p={16}>Footer</Text>}
                onSelect={(option, dismiss) => {
                    dismiss()
                    setSelected([...selected, option.key])
                }}
                onFilter={(text: string) => console.log('Do API call with ' + text)}
                filterDelay={1000}
            />
        </Stack>
    )
}

// --

export const HeaderAndFooter = () => {
    const [selected, setSelected] = useState<any>([timezones[1]])

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <Select
            width={350}
            placeholder="Select a timezone"
            selected={selected}
            onSelect={handleSelect}
            options={timezones.map((tz) => ({
                key: tz,
                label: tz,
            }))}
            header={
                <Text
                    size="sm"
                    p={20}
                    fontWeight="bold">
                    Please select a timezone for your country.
                </Text>
            }
            footer={
                <View
                    row
                    justifyContent="flex-start">
                    <Text
                        size="sm"
                        p={20}
                        as="a"
                        onClick={() => setSelected([])}>
                        Clear Selection
                    </Text>
                </View>
            }
        />
    )
}

// --

export const Filtering = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    const handleFilter = (text: string) => {
        // do an API call to get more options
    }

    return (
        <Select
            width={350}
            placeholder="Select a timezone"
            selected={selected}
            options={timezones.map((tz) => ({
                key: tz,
                label: tz,
            }))}
            onSelect={handleSelect}
            onFilter={handleFilter}
            prefix={<IconLib icon="time" />}
            suffix={<IconLib icon="chevron-down" />}
            filterDelay={500}
        />
    )
}

// --

export const CustomRendering = () => {
    const [notFound, setNotFound] = useState(false)
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const options = timezones.map((tz) => ({
        key: tz,
        label: tz,
    }))

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    const notFoundItem = () => {
        if (notFound) {
            return [{ key: 'x', label: 'Create', sticky: true }]
        } else {
            return []
        }
    }

    return (
        <Select
            width={350}
            hideSelected
            placeholder="Select a timezone"
            disabled={false}
            readOnly={false}
            selected={selected}
            options={[...notFoundItem(), ...options]}
            onSelect={handleSelect}
            onFilter={(text: string) => setNotFound(!!text)}
            prefix={
                <div
                    style={{ padding: '0 0.5rem' }}
                    className="f-buttonize">
                    🚀
                </div>
            }
            filterDelay={500}
            render={() => {
                return (
                    <>
                        {selected.map((s1, i) => (
                            <Pill
                                key={i}
                                outline
                                color={Token.ColorElectric300}
                                suffix={
                                    <Icon
                                        icon="x"
                                        onClick={(e) => {
                                            setSelected(selected.filter((s2) => s1 != s2))
                                        }}
                                    />
                                }>
                                {s1}
                            </Pill>
                        ))}
                    </>
                )
            }}
        />
    )
}

// --

/**
 * List virtualization only displays the options in the view pane, enabling better performance
 * and handling large datasets. Please note this feature is in beta,
 */
export const ListVirtualization = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <Select
            width={350}
            as="virtual"
            placeholder="Select a timezone"
            selected={selected}
            onSelect={handleSelect}
            options={timezones.map((tz) => ({
                key: tz,
                label: tz,
            }))}
        />
    )
}

// --

export const StandaloneListDefault = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])
    const options = timezones.map((option: any, index) => {
        return {
            key: option,
            label: option,
        }
    })
    const [cursor, setCursor] = useState(-1)
    const listRef = useRef(null)

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <SelectList
            ref={listRef}
            as="default"
            cursor={cursor}
            options={options}
            selected={selected}
            onOptionClick={handleSelect}
        />
    )
}

// --

export const StandaloneListVirtual = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const options = timezones.map((option: any, index) => {
        return {
            key: option,
            label: option,
        }
    })

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    return (
        <SelectList
            as="virtual"
            options={options}
            selected={selected}
            onOptionClick={handleSelect}
        />
    )
}

// --

export const OptionConfigurationAndForcedPlaceholder = () => {
    const [selected, setSelected] = useState<any>([])

    const options = timezones.map((option: any, index): SelectOption => {
        return {
            key: option,
            label: option,
            disabled: index % 7 == 0,
            customContent:
                index == 4 ? (
                    <View p="1rem 0">
                        <Divider />
                    </View>
                ) : null,
        }
    })

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    const handleFilter = (text: string) => {
        // do an API call to get more options
    }

    return (
        <Select
            width={350}
            as="virtual"
            prefix={<IconLib icon="time" />}
            suffix={<IconLib icon="chevron-down" />}
            customPlaceholder={`Timezones selected: ${selected.length}`}
            placeholder=""
            disabled={false}
            readOnly={false}
            selected={selected}
            options={options}
            header={undefined}
            footer={undefined}
            onSelect={handleSelect}
            onFilter={handleFilter}
            filterDelay={1000}
        />
    )
}

// --

export const CustomComponent = () => {
    const [selected, setSelected] = useState<any>([timezones[0], timezones[4], timezones[8]])

    const options = timezones.map((option: any, index) => {
        return {
            key: option,
            label: option,
        }
    })

    const handleSelect = (option, dismiss) => {
        if (selected.includes(option.key)) {
            setSelected([...selected.filter((optionKey) => option.key != optionKey)])
        } else {
            setSelected([...selected, option.key])
        }
    }

    const handleFilter = (text: string) => {
        // do an API call to get more options
    }

    // Warning!
    // Don't ever inline components like this
    // This is purely to encapsulate the example in a single component
    const OptionComponent = (props: SelectOptionProps) => {
        const { option, onOptionClick, selected } = props
        const { key, label } = option
        const title = useMemo(() => label.split('/').join(' '), [label])

        return (
            <View
                row
                p={10}
                gap={10}
                className="f-buttonize"
                justifyContent="flex-start"
                onClick={onOptionClick}
                bgToken={selected ? 'surface-stronger' : undefined}>
                <Avatar
                    size="md"
                    name={title}
                />
                <View
                    column
                    alignItems="flex-start"
                    flex={1}>
                    <Text>{title}</Text>
                    <Text size="sm">{key}</Text>
                </View>
            </View>
        )
    }

    return (
        <Select
            width={350}
            placeholder="Select a timezone"
            selected={selected}
            options={options}
            onSelect={handleSelect}
            onFilter={handleFilter}
            filterDelay={1000}
            optionComponent={OptionComponent}
        />
    )
}

// --

/**
 * The Tag select uses the TagInput component to enable a common tag-like user experience
 */
export const Tag = () => {
    const labels = [
        'component',
        'frontend',
        'dev',
        'ux',
        'work',
        'home',
        'school',
        'everything else',
        'urgent',
        'roadmap',
        'design tokens',
        'react',
        'web components',
        'vue',
        'angular',
    ]
    const [selected, setSelected] = useState<any>(['web components', 'vue', 'angular'])
    const [notFound, setNotFound] = useState<any>(null)
    const options = [...labels].map((option: any, index) => {
        return {
            key: option,
            label: option,
            suffix: <IconLib icon="tag" />,
            disabled: false,
            customContent: null,
        }
    })

    const notFoundItem = () => {
        if (notFound) {
            return [
                {
                    key: notFound,
                    label: 'Create <strong>' + notFound + '</strong>',
                    suffix: (
                        <Pill
                            subtle
                            prefix={
                                <IconLib
                                    icon="plus"
                                    size="xs"
                                    strokeWidth={2}
                                />
                            }
                            color={Token.ColorElectric300}
                            size="xs">
                            New
                        </Pill>
                    ),
                    sticky: true,
                },
            ]
        } else {
            return []
        }
    }

    const handleInputKeyDown = (e) => {
        const { isBackspace } = getKey(e)
        const isEmpty = e.target.value == ''
        if (isBackspace && isEmpty) setSelected([...selected.slice(0, -1)])
    }

    return (
        <Select
            tagInput
            noListFocus
            as="default"
            width={500}
            placeholder="Select a label"
            disabled={false}
            readOnly={false}
            selected={selected}
            options={[...notFoundItem(), ...options]}
            filterDelay={1000}
            tagInputFieldProps={{ onKeyDown: handleInputKeyDown }}
            onSelect={(option, dismiss, clear) => {
                clear()
                setSelected([...selected, option.key])
                if (notFound) setNotFound(null)
            }}
            onFilter={(text: string) => {
                const filteredOptions = options.filter((option) =>
                    option.label.toLowerCase().includes(text.toLowerCase())
                )
                setNotFound(filteredOptions.length == 0 ? text : null)
            }}
            render={() => {
                return (
                    <>
                        {selected.map((s1, i) => (
                            <Pill
                                key={i}
                                outline
                                color={Token.ColorElectric300}
                                size="sm"
                                suffix={
                                    <IconLib
                                        icon="x"
                                        onClick={(e) => {
                                            setSelected(selected.filter((s2) => s1 != s2))
                                        }}
                                    />
                                }>
                                {s1}
                            </Pill>
                        ))}
                    </>
                )
            }}
        />
    )
}

// --

/**
 * The user & label Select component are prepackaged select formats specifically for
 * use in-product, they are 100% reproducable simply using a normal Select component
 * Please note these examples are a work-in-progress.
 */
export const UserAndLabelSelect = () => {
    const labels: LabelSelectLabel[] = [
        { id: 'l1', color: Token.ColorElectric400, icon: 'star', text: 'Shopping' },
        { id: 'l2', color: Token.ColorYellow400, text: 'Groceries' },
        { id: 'l3', color: Token.ColorNeonpink400, text: 'Housework' },
        { id: 'l4', icon: 'building', text: 'Office' },
        { id: 'l5', text: 'Everything else' },
    ]

    const selectedLabels = [
        { id: 'l1', color: Token.ColorElectric400, icon: 'star', text: 'Shopping' },
        { id: 'l4', icon: 'building', text: 'Office' },
        { id: 'l5', text: 'Everything else' },
    ]

    const users: UserSelectUser[] = [
        { id: 'u1', name: 'John', image: '/men/01.jpg' },
        { id: 'u2', name: 'Ben', image: '/men/02.jpg' },
        { id: 'u3', name: 'Derek', image: '/men/03.jpg' },
        { id: 'u4', name: 'Samantha', image: '/women/01.jpg' },
        { id: 'u5', name: 'Sarah', image: '/women/02.jpg' },
        { id: 'u6', name: 'Byron', image: '/men/04.jpg' },
        { id: 'u7', name: 'Andrew', image: '/men/05.jpg' },
        { id: 'u8', name: 'Peter' },
    ]

    const selectedUsers = [
        { id: 'u1', name: 'John', image: '/men/07.jpg' },
        { id: 'u2', name: 'Ben', image: '/men/08.jpg' },
        { id: 'u5', name: 'Timothy', image: '/men/09.jpg' },
    ]

    return (
        <View
            row
            gap={10}
            alignItems="flex-start"
            justifyContent="flex-start">
            <View width={300}>
                <LabelSelect
                    width={300}
                    labels={selectedLabels}
                    availableLabels={labels}
                    inputPlaceholder="Add label..."
                    onLabelAdd={(label) => console.log('label add', label)}
                    onLabelDelete={(label) => console.log('label delete', label)}
                    onFilter={(value) => console.log('search ', value)}
                />
            </View>
            <View width={300}>
                <UserSelect
                    width={300}
                    users={selectedUsers}
                    availableUsers={users}
                    inputPlaceholder="Add user..."
                    onUserAdd={(user) => console.log('user add', user)}
                    onUserDelete={(user) => console.log('user delete', user)}
                    onFilter={(value) => console.log('search ', value)}
                />
            </View>
        </View>
    )
}
