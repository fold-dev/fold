import * as Token from '@fold-dev/design/tokens'
import {
    Divider,
    Heading,
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
    component: TaskCard,
}

export const docs = {
    title: 'Task',
    subtitle: 'The Task component represents an item on a todo list or card on a kanban board.',
    description: 'Tasks are useful for giving the user a visual element to interact with on a task list. They are especially relevant in task managers; however, task components can enable a wide variety of tooling within a product.',
    experimental: true,
}

export const Usage = () => {
    const PopupMenu = ({ target }) => (
        <Menu>
            <MenuItem>Menu item for {target}</MenuItem>
        </Menu>
    )

    const task1: TaskProps = {
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
        badges: [
            { icon: 'eye' },
            { icon: 'menu' },
            { icon: 'message', label: '2' },
            { icon: 'paperclip', label: '3' },
            { label: '3/4', progress: 75, color: Token.ColorOrange400 },
        ],
    }
    
    const task2: TaskProps = {
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
    
    const task3: TaskProps = {
        id: '3',
        title: 'Component dev pipeline, build pipeline & design system setup',
        complete: false,
        selected: true,
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
    
    return (
        <MenuProvider
            menu={({ data: { target, payload }, dismiss }) => {
                switch (target) {
                    case 'task-label': return <PopupMenu target={target} />
                    case 'task-user': return <PopupMenu target={target} />
                    case 'task-menu': return <PopupMenu target={target} />
                    case 'task-date': return <PopupMenu target={target} />
                    default: return null
                }
            }}>
            <Heading as="h3">Cards</Heading>
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
            <Heading as="h3">List</Heading>
            <Stack
                p={50}
                spacing={0}
                direction="vertical">
                <TaskListItem {...task1} />
                <TaskListItem {...task2} />
                <TaskListItem {...task3} />
                <TaskListItem {...task4} />
            </Stack>
        </MenuProvider>
    )
}

// --

export const Editable = () => {
    const { title, description, labels, users, setTask, clearTask } = useTaskEdit()

    const PopupMenu = ({ target }) => (
        <Menu>
            <MenuItem>Menu item for {target}</MenuItem>
        </Menu>
    )

    const task1: TaskProps = {
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
        badges: [
            { icon: 'eye' },
            { icon: 'menu' },
            { icon: 'message', label: '2' },
            { icon: 'paperclip', label: '3' },
            { label: '3/4', progress: 75, color: Token.ColorOrange400 },
        ],
    }

    return (
        <MenuProvider
            menu={({ data: { target, payload }, dismiss }) => {
                switch (target) {
                    case 'task-label': return <PopupMenu target={target} />
                    case 'task-user': return <PopupMenu target={target} />
                    case 'task-menu': return <PopupMenu target={target} />
                    case 'task-date': return <PopupMenu target={target} />
                    default: return null
                }
            }}>
            <TaskListItem
                {...task1}
                onClick={() => setTask(task1)}
            />
            <Divider />
            <TaskEditMode
                title={title}
                description={description}
                users={users}
                labels={labels}
                onEdit={() => console.log('open open')}
                onConfirm={() => console.log('save!')}
                onDismiss={clearTask}
            />
            <Divider />
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
            <Divider />
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
            <Divider />
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
        </MenuProvider>
    )
}
