import * as Token from '@fold-dev/design/tokens'
import {
    Menu,
    MenuItem,
    MenuProvider,
    Stack,
    TaskCard,
    TaskEditMode,
    TaskListItem,
    TaskProps,
    useTaskEdit,
    View,
} from '@fold-dev/core'
import React from 'react'

export default {
    title: 'Components/Task',
    component: <></>,
}

export const docs = {
    title: 'Task',
    subtitle: '',
    description: '',
}

const task1 = {
    id: '1',
    title: 'Component dev pipeline, build pipeline & design system setup',
    description:
        'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don not look even slightly believable.',
    complete: false,
    image: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhcnRvb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    users: [
        { id: 'u1', name: 'Johannes', image: '/men/09.jpg' },
        { id: 'u1', name: 'Benjamin', image: '/men/06.jpg' },
        { id: 'u1', name: 'du Plessis' },
    ],
    labels: [
        { id: 'l1', icon: 'zap', color: Token.ColorElectric400, text: 'mvp' },
        { id: 'l4', text: 'pull request', color: Token.ColorNeonpink400 },
        { id: 'l5', icon: 'frontend', color: Token.ColorAccent400, text: 'experiment' },
    ],
    dates: {
        start: new Date(),
        end: new Date(),
    },
    badges: [
        { icon: 'eye' },
        { icon: 'menu' },
        { icon: 'message', label: '2' },
        { icon: 'paperclip', label: '3' },
        { label: '3/4', progress: 75, color: Token.ColorOrange400 },
    ],
}

const task2 = {
    id: '2',
    title: 'Component dev pipeline, build pipeline & design system setup. Component dev pipeline, build pipeline & design system setup. Component dev pipeline, build pipeline & design system setup.',
    description:
        'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don not look even slightly believable. ',
    complete: true,
    image: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhcnRvb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    users: [
        { id: 1, name: 'Johannes', image: '/men/09.jpg' },
        { id: 1, name: 'Benjamin', image: '/men/06.jpg' },
        { id: 1, name: 'du Plessis' },
    ],
}

const task3 = {
    id: '3',
    title: 'Component dev pipeline, build pipeline & design system setup',
    complete: false,
    selected: true,
    dates: {
        start: new Date(),
        end: new Date(),
        color: Token.ColorTeal400,
    },
    users: [{ id: 1, name: '+' }],
}

const task4: TaskProps = {
    id: '4',
    title: 'Component dev pipeline, build pipeline & design system setup',
    complete: false,
    priority: 'medium',
    locked: true,
    image: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhcnRvb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    users: [
        { id: 1, name: 'Johannes', image: '/men/09.jpg' },
        { id: 1, name: 'Benjamin', image: '/men/06.jpg' },
        { id: 1, name: 'du Plessis' },
    ],
}

const TaskMenu = () => <div>task menu</div>

const TaskDateMenu = () => <div>task menu</div>

export const Default = () => {
    return (
        <MenuProvider
            menu={({ data: { target, payload }, dismiss }) => {
                switch (target) {
                    case 'task-label':
                        return (
                            <Menu>
                                <MenuItem>Task Label</MenuItem>
                            </Menu>
                        )
                    case 'task-user':
                        return (
                            <Menu>
                                <MenuItem>Task User</MenuItem>
                            </Menu>
                        )
                    case 'task-menu':
                        return <TaskMenu />
                    case 'task-date':
                        return <TaskDateMenu />
                    default:
                        return null
                }
            }}>
            <View bgToken="background">
                <Stack
                    p="50px 50px 0 50px"
                    spacing={10}
                    direction="horizontal">
                    <TaskCard
                        {...task1}
                        width={300}
                    />
                    <TaskCard
                        {...task2}
                        width={300}
                    />
                    <TaskCard
                        {...task3}
                        width={300}
                    />
                    <TaskCard
                        {...task4}
                        width={300}
                    />
                </Stack>
                <Stack
                    p={50}
                    spacing={10}
                    direction="vertical">
                    <TaskListItem {...task1} />
                    <TaskListItem {...task2} />
                    <TaskListItem {...task3} />
                    <TaskListItem {...task4} />
                </Stack>
            </View>
        </MenuProvider>
    )
}

export const Menus = () => {
    return (
        <Stack
            p="50px 50px 0 50px"
            spacing={10}
            direction="horizontal">
            <TaskMenu />
            <TaskDateMenu />
        </Stack>
    )
}

export const Editing = () => {
    const { title, description, labels, users, setTask, clearTask } = useTaskEdit()

    return (
        <MenuProvider
            menu={({ data: { target, payload }, dismiss }) => {
                switch (target) {
                    case 'task-label':
                        return (
                            <Menu>
                                <MenuItem>Task Label</MenuItem>
                            </Menu>
                        )
                    case 'task-user':
                        return (
                            <Menu>
                                <MenuItem>Task User</MenuItem>
                            </Menu>
                        )
                    case 'task-menu':
                        return <TaskMenu />
                    case 'task-date':
                        return <TaskDateMenu />
                    default:
                        return null
                }
            }}>
            <View
                bgToken="background"
                p="5rem 2rem">
                <TaskListItem
                    {...task1}
                    onClick={() => setTask(task1)}
                />
                <br />
                <TaskEditMode
                    title={title}
                    description={description}
                    users={users}
                    labels={labels}
                    onEdit={() => console.log('open open')}
                    onConfirm={() => console.log('save!')}
                    onDismiss={clearTask}
                />
                <br />
                <TaskEditMode
                    title={title}
                    description={description}
                    users={users}
                    labels={labels}
                    onEdit={() => console.log('open open')}
                    onConfirm={() => console.log('save!')}
                    onDismiss={clearTask}
                    hideToolbar
                />
                <br />
                <TaskEditMode
                    title={title}
                    description={description}
                    users={users}
                    labels={labels}
                    onEdit={() => console.log('open open')}
                    onConfirm={() => console.log('save!')}
                    onDismiss={clearTask}
                    hideToolbar
                    hideDescription
                />
                <br />
                <TaskEditMode
                    title={title}
                    description={description}
                    users={users}
                    labels={labels}
                    onEdit={() => console.log('open open')}
                    onConfirm={() => console.log('save!')}
                    onDismiss={clearTask}
                    hideDescription
                />
            </View>
        </MenuProvider>
    )
}
