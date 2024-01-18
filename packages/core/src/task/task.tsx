import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
    Avatar,
    AvatarGroup,
    Button,
    CheckboxAlt,
    CircularProgress,
    classNames,
    ContextMenuContext,
    CoreViewProps,
    dispatchPubsub,
    getActionClass,
    getKey,
    IconLib,
    Image,
    LabelSelectLabel,
    Pill,
    Progress,
    Text,
    Textarea,
    useCheck,
    useInput,
    usePubsub,
    UserSelectUser,
    View,
    windowObject,
} from '../'

// labels

export type TaslLabelProps = {
    icon?: string
    text: string
    color: string
    onClick: (e) => void
    subtle?: boolean
}

export const TaskLabel = ({ icon = null, text, color, onClick, subtle = true }: TaslLabelProps) => {
    return (
        <Pill
            subtle={subtle}
            size="sm"
            color={color}
            onClick={onClick}
            prefix={
                icon ? (
                    <IconLib
                        icon={icon}
                        size="xs"
                    />
                ) : undefined
            }>
            {text}
        </Pill>
    )
}

export type TaslLabelsProps = {
    labels: TaskLabel[]
    onClick: (e) => void
}

export const TaskLabels = ({ labels, onClick }: TaslLabelsProps) => {
    if (labels.length == 0) return null
    return labels.map((label: any, index: number) => (
        <TaskLabel
            key={index}
            icon={label.icon}
            text={label.text}
            color={label.color}
            subtle={label.subtle}
            onClick={onClick}
        />
    ))
}

// avatars

export type TaslAvatarsProps = {
    users: TaskUser[]
    onClick: (e) => void
} & Omit<CoreViewProps, 'onClick'>

export const TaskAvatars = ({ users, onClick, ...rest }: TaslAvatarsProps) => {
    if (users.length == 0) return null
    const { avatars, more } = useMemo(() => {
        const avatars = users.slice(0, 2)
        const more = users.length - avatars.length
        return {
            avatars,
            more: more == 0 ? '' : more,
        }
    }, [users])

    return (
        <AvatarGroup
            {...rest}
            className="f-buttonize"
            onClick={onClick}>
            {avatars.map((avatar: any, index: number) => (
                <Avatar
                    size="sm"
                    name={avatar.name}
                    src={avatar.image}
                    key={index}
                />
            ))}
            {more && (
                <Avatar
                    size="sm"
                    name={`+ ${more}`}
                />
            )}
        </AvatarGroup>
    )
}

// badges

export const TaskBadge = ({ icon, label, color, progress, onClick }: TaskBadge) => {
    return (
        <span
            className="f-row f-buttonize f-task-badge"
            style={{ color, gap: 5 }}
            onClick={onClick}>
            {icon && (
                <IconLib
                    icon={icon}
                    size="sm"
                />
            )}
            {progress && (
                <CircularProgress
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

export type TaskBadgesProps = {
    badges: TaskBadge[]
    onClick: (e) => void
}

export const TaskBadges = ({ badges, onClick }: TaskBadgesProps) => {
    const allBadges = useMemo(() => badges.filter((badge: TaskBadge) => !badge.hide), [badges])

    return allBadges.map((badge: any, index: number) => (
        <TaskBadge
            key={index}
            icon={badge.icon}
            label={badge.label}
            progress={badge.progress}
            color={badge.color}
            onClick={onClick}
        />
    ))
}

// hover menu button

export type TaskMenuButtonProps = {
    edit?: boolean
    onEditClick?: (e) => void
    date?: boolean
    onDateClick?: (e) => void
    menu?: boolean
    onMenuClick?: (e) => void
}

export const TaskMenuButton = ({
    edit = false,
    onEditClick = null,
    date = false,
    onDateClick = null,
    menu = false,
    onMenuClick = null,
}: TaskMenuButtonProps) => {
    return (
        <div className="f-task-menu-button f-row">
            {edit && (
                <button
                    className="f-buttonize f-row"
                    onClick={onEditClick}>
                    <IconLib icon="pen" />
                </button>
            )}

            {date && (
                <button
                    className="f-buttonize f-row"
                    onClick={onDateClick}>
                    <IconLib icon="date" />
                </button>
            )}

            {menu && (
                <button
                    className="f-buttonize f-row"
                    onClick={onMenuClick}>
                    <IconLib icon="more-h" />
                </button>
            )}
        </div>
    )
}

// checkbox

export type TaskCheckboxProps = {
    onCheck: (e) => void
    checked: boolean
}

export const TaskCheckbox = ({ onCheck, checked }: TaskCheckboxProps) => (
    <div className="f-task-checkbox f-row">
        <CheckboxAlt
            icon="check"
            onChange={onCheck}
            checked={checked}
            iconProps={{
                size: 'sm',
                style: {
                    position: 'relative',
                    left: -1,
                },
            }}
        />
    </div>
)

// text

export type TaskTextTitleProps = {
    text: string
    complete: boolean
}

export const TaskTextTitle = ({ text, complete }: TaskTextTitleProps) => (
    <p
        className={'f-task-text-title f-text ' + (complete ? ' is-complete' : '')}
        dangerouslySetInnerHTML={{ __html: text }}
    />
)

export type TaskTextDescriptionProps = {
    text: string
    complete: boolean
}

export const TaskTextDescription = ({ text, complete }: TaskTextDescriptionProps) => (
    <p
        className={'f-task-text-description f-text ' + (complete ? ' is-complete' : '')}
        dangerouslySetInnerHTML={{ __html: text }}
    />
)

// card & list item cards

export type TaskBadge = {
    icon?: string
    color?: string
    progress?: number
    label?: string
    hide?: boolean
    onClick?: (e) => void
}

export type TaskUser = {} & UserSelectUser

export type TaskLabel = {} & LabelSelectLabel

export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
    id?: number | string
    title: string
    description?: string
    complete?: boolean
    locked?: boolean
    progress?: number
    priority?: TaskPriority
    image?: string
    users?: TaskUser[]
    labels?: TaskLabel[]
    badges?: TaskBadge[]
}

export type TaskProps = {
    selected?: boolean
    hideCheckbox?: boolean
} & Task &
    CoreViewProps

export const TaskCard = (props: TaskProps) => {
    const {
        id,
        title,
        description,
        complete,
        locked,
        progress,
        priority,
        image,
        users = [],
        labels = [],
        badges = [],
        selected = false,
        hideCheckbox,
        ...rest
    } = props
    const ref = useRef(null)
    const { setMenu } = useContext(ContextMenuContext)
    const { checked, check } = useCheck(complete)
    const showFooterBody = useMemo(
        () => !!labels.length || !!badges.filter((b) => !b.hide).length || !!users.length,
        [labels, badges, users]
    )
    const className = classNames(
        {
            'f-task-card': true,
            'f-col': true,
            'is-selected': selected,
            'is-locked': locked,
        },
        [props.className, getActionClass(priority)]
    )

    const getTaskSummary = () => ({
        id,
        title,
        description,
        complete,
        locked,
        priority,
        users,
        labels,
        badges,
        hideCheckbox,
        selected,
    })

    const handleAvatarClick = (e) =>
        setMenu({ target: 'task-user', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })

    const handleMenuClick = (e) =>
        setMenu({ target: 'task-menu', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })

    const handleLabelClick = (e) =>
        setMenu({ target: 'task-label', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })

    const handleBadgeClick = (e) =>
        setMenu({ target: 'task-badge', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })

    const handleContextMenuClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setMenu({ target: 'task-menu', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })
    }

    useLayoutEffect(() => {
        const el: any = ref.current
        if (el) el.addEventListener('contextmenu', handleContextMenuClick)
        return () => el.removeEventListener('contextmenu', handleContextMenuClick)
    })

    return (
        <View
            {...rest}
            ref={ref}
            disabled={locked}
            className={className}
            tabIndex={locked ? -1 : 0}>
            <div className="f-task-card__inner f-col">
                {!!image && (
                    <div className="f-task-card__image">
                        <Image
                            src={image}
                            height={150}
                        />
                    </div>
                )}

                <div className="f-task-card__content f-row">
                    {!hideCheckbox && (
                        <TaskCheckbox
                            checked={checked}
                            onCheck={check}
                        />
                    )}

                    <div className="f-task-card__text f-col">
                        <TaskTextTitle
                            text={title}
                            complete={checked}
                        />

                        <TaskTextDescription
                            text={description}
                            complete={checked}
                        />
                    </div>
                </div>

                <div className="f-task-card__panel f-row">
                    <TaskLabels
                        labels={labels}
                        onClick={handleLabelClick}
                    />
                </div>

                {progress && (
                    <div className="f-task-card__panel f-row">
                        <Progress value={progress} />
                    </div>
                )}

                {showFooterBody && (
                    <div className="f-task-card__panel f-row">
                        <TaskBadges
                            badges={badges}
                            onClick={handleBadgeClick}
                        />

                        <TaskAvatars
                            m="0 0 0 auto"
                            users={users}
                            onClick={handleAvatarClick}
                        />
                    </div>
                )}
            </div>

            <TaskMenuButton
                menu
                onMenuClick={handleMenuClick}
            />
        </View>
    )
}

export const TaskListItem = (props: TaskProps) => {
    const {
        id,
        title,
        description,
        complete,
        locked,
        priority = 'none',
        users = [],
        labels = [],
        badges = [],
        selected = false,
        hideCheckbox,
        ...rest
    } = props
    const ref = useRef(null)
    const { setMenu } = useContext(ContextMenuContext)
    const [edit, setEdit] = useState(false)
    const { checked, check } = useCheck(complete)
    const showContent = useMemo(
        () => badges.filter((b) => !b.hide).length || labels.length || !!description,
        [badges, labels, description]
    )
    const className = classNames(
        {
            'f-task-list-item': true,
            'is-selected': selected,
            'is-locked': locked,
        },
        [props.className, getActionClass(priority)]
    )

    const getTaskSummary = () => ({
        id,
        title,
        description,
        complete,
        locked,
        priority,
        users,
        labels,
        badges,
        hideCheckbox,
        selected,
    })

    const handleEditClick = (e) => setEdit(true)

    const handleAvatarClick = (e) =>
        setMenu({ target: 'task-user', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })

    const handleDateClick = (e) =>
        setMenu({ target: 'task-date', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })

    const handleMenuClick = (e) =>
        setMenu({ target: 'task-menu', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })

    const handleContextMenuClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setMenu({ target: 'task-menu', payload: getTaskSummary() }, { x: e.clientX, y: e.clientY })
    }

    useLayoutEffect(() => {
        const el: any = ref.current
        if (el) el.addEventListener('contextmenu', handleContextMenuClick)
        return () => el.removeEventListener('contextmenu', handleContextMenuClick)
    })

    return (
        <View
            {...rest}
            ref={ref}
            disabled={locked}
            className={className}
            tabIndex={locked ? -1 : 0}>
            <div className="f-task-list-item__inner">
                <div className="f-task-list-item__title f-row">
                    {!hideCheckbox && (
                        <TaskCheckbox
                            checked={checked}
                            onCheck={check}
                        />
                    )}

                    <TaskTextTitle
                        text={title}
                        complete={checked}
                    />

                    <TaskAvatars
                        users={users}
                        onClick={handleAvatarClick}
                    />
                </div>

                {showContent && (
                    <div className="f-task-list-item__content f-col">
                        <TaskTextDescription
                            text={description}
                            complete={checked}
                        />

                        <div className="f-task-list-item__panel f-row">
                            <TaskBadges
                                badges={badges}
                                onClick={null}
                            />

                            <TaskLabels
                                labels={labels}
                                onClick={null}
                            />
                        </div>
                    </div>
                )}
            </div>

            <TaskMenuButton
                edit
                onEditClick={handleEditClick}
                date
                onDateClick={handleDateClick}
                menu
                onMenuClick={handleMenuClick}
            />
        </View>
    )
}

// Edit mode

export type TaskEditModeProps = {
    title: any
    description: any
    dates?: any
    labels: any
    users: any
    hideToolbar?: boolean
    hideDescription?: boolean
    monthNames?: string[]
    onEdit?: (e) => void
    onConfirm: () => void
    onDismiss: () => void
    onIndent?: () => void
    onOutdent?: () => void
} & CoreViewProps

export const useTaskEdit = () => {
    const title = useInput('')
    const description = useInput('')
    const labels = useInput([])
    const users = useInput([])

    const setTask = (task: Task) => {
        title.setValue(task.title)
        description.setValue(task.description)
        labels.setValue(task.labels)
        users.setValue(task.users)
    }

    const clearTask = () => {
        title.setValue('')
        description.setValue('')
        labels.setValue([])
        users.setValue([])
    }

    return {
        title,
        description,
        labels,
        users,
        setTask,
        clearTask,
    }
}

const getLabelsText = (arr) => {
    if (arr.length == 0) return 'No labels'
    const more = arr.length - 2
    const moreText = more > 0 ? ` + ${more}` : ''
    return `${arr
        .slice(0, 2)
        .map((a) => a.text)
        .join(', ')}${moreText}`
}

const getUsersText = (arr) => {
    if (arr.length == 0) return 'No users'
    const more = arr.length - 2
    const moreText = more > 0 ? ` + ${more}` : ''
    return `${arr
        .slice(0, 2)
        .map((a) => a.name)
        .join(', ')}${moreText}`
}

export const TaskEditMode = (props: TaskEditModeProps) => {
    const {
        title,
        description,
        labels,
        users,
        hideToolbar,
        hideDescription,
        onEdit,
        onConfirm,
        onDismiss,
        onIndent,
        onOutdent,
        ...rest
    } = props
    const { setMenu } = useContext(ContextMenuContext)
    const texts: any = useMemo(() => {
        return {
            labels: getLabelsText(labels.value),
            users: getUsersText(users.value),
        }
    }, [labels, users])

    const handleLabelClick = (e) => setMenu({ target: 'task-label' }, { x: e.clientX, y: e.clientY })

    const handleAvatarClick = (e) => setMenu({ target: 'task-user' }, { x: e.clientX, y: e.clientY })

    const handleDateClick = (e) => setMenu({ target: 'task-date' }, { x: e.clientX, y: e.clientY })

    const handleMenuClick = (e) => setMenu({ target: 'task-menu' }, { x: e.clientX, y: e.clientY })

    const handleKeyDown = (e) => {
        const { isEscape, isEnter, isShift, isRight, isLeft } = getKey(e)

        const stopEvent = () => {
            e.preventDefault()
            e.stopPropagation()
        }

        if (isEscape) {
            stopEvent()
            onDismiss()
        }

        if (isEnter) {
            stopEvent()
            onConfirm()
        }

        if (isShift && isRight) {
            stopEvent()
            onIndent()
        }

        if (isShift && isLeft) {
            stopEvent()
            onOutdent()
        }
    }

    return (
        <View
            {...rest}
            onKeyDown={handleKeyDown}
            className="f-task-em f-col">
            <Textarea
                autoFocus
                autoAdjust
                minHeight={40}
                maxHeight={100}
                placeholder="Task title"
                value={title.value}
                onChange={title.onChange}
            />

            {!hideDescription && (
                <div className="f-task-em__desc f-row">
                    <IconLib icon="menu" />
                    <Textarea
                        autoAdjust
                        size="sm"
                        minHeight={30}
                        maxHeight={100}
                        placeholder="Task description"
                        value={description.value}
                        onChange={description.onChange}
                    />
                </div>
            )}

            {!hideToolbar && (
                <div className="f-row f-task-em__toolbar">
                    <Button
                        subtle
                        size="sm"
                        variant="accent"
                        prefix={<IconLib icon="date" />}
                        onClick={handleDateClick}>
                        {texts.dates ? texts.dates : 'No dates'}
                    </Button>

                    <Button
                        subtle
                        size="sm"
                        variant="accent"
                        prefix={<IconLib icon="tag" />}
                        onClick={handleLabelClick}>
                        {texts.labels}
                    </Button>

                    <Button
                        subtle
                        size="sm"
                        variant="accent"
                        prefix={<IconLib icon="user" />}
                        onClick={handleAvatarClick}>
                        {texts.users}
                    </Button>

                    <Button
                        subtle
                        size="sm"
                        variant="accent"
                        onClick={handleMenuClick}>
                        <IconLib icon="more-h" />
                    </Button>

                    <Button
                        subtle
                        size="sm"
                        m="0 0 0 auto"
                        onClick={onDismiss}>
                        Cancel
                    </Button>

                    {onEdit && (
                        <Button
                            subtle
                            size="sm"
                            variant="accent"
                            onClick={onEdit}>
                            <IconLib icon="pen" />
                        </Button>
                    )}

                    <Button
                        subtle
                        size="sm"
                        variant="accent"
                        onClick={onConfirm}>
                        <IconLib icon="check-circle" />
                    </Button>
                </div>
            )}
        </View>
    )
}
