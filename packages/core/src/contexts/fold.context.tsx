import React, { useLayoutEffect, useState } from 'react'
import { Alert, AlertOptions } from '../alert/alert'
import { DragManager, DragManagerProps } from '../drag/drag'
import { useTheme } from '../hooks/theme.hook'
import {
    FIArrowDown,
    FIArrowLeft,
    FIArrowRight,
    FIArrowUp,
    FIBin,
    FICheck,
    FICheckCircle,
    FIChevronDown,
    FIChevronLeft,
    FIChevronRight,
    FIChevronUp,
    FICircle,
    FIClear,
    FIClipboard,
    FICog,
    FICopy,
    FIDataGridSort,
    FIDate,
    FIDateDots,
    FIEye,
    FIEyeDropper,
    FIEyeLine,
    FIFlag,
    FIGift,
    FIImage,
    FIKanbanMaximize,
    FIKanbanMinimize,
    FILink,
    FILinkOut,
    FIMaximize,
    FIMenu,
    FIMinimize,
    FIMinus,
    FIMoon,
    FIMoreH,
    FIMoreV,
    FINext,
    FIPaperclip,
    FIPause,
    FIPen,
    FIPlay,
    FIPlus,
    FIRotateLeft,
    FIRotateRight,
    FISearch,
    FIStar,
    FISun,
    FITag,
    FITime,
    FIUpload,
    FIUser,
    FIWarning,
    FIX,
    setFoldIcons,
} from '../icon'
import { ToastContainer } from '../toast/toast'
import { DialogOptions } from '../dialog/dialog'

export const defaultIcons = {
    'cog': FICog,
    'data-grid-sort': FIDataGridSort,
    'rotate-left': FIRotateLeft,
    'rotate-right': FIRotateRight,
    'eye': FIEye,
    'eye-line': FIEyeLine,
    'bin': FIBin,
    'sun': FISun,
    'moon': FIMoon,
    'eye-dropper': FIEyeDropper,
    'plus': FIPlus,
    'minus': FIMinus,
    'chevron-left': FIChevronLeft,
    'chevron-right': FIChevronRight,
    'chevron-down': FIChevronDown,
    'chevron-up': FIChevronUp,
    'image': FIImage,
    'minimize': FIMinimize,
    'todo-collapse': FIChevronDown,
    'kanban-minimize': FIKanbanMinimize,
    'maximize': FIMaximize,
    'kanban-maximize': FIKanbanMaximize,
    'more-h': FIMoreH,
    'more-v': FIMoreV,
    'check': FICheck,
    'x': FIX,
    'date': FIDate,
    'circle': FICircle,
    'upload': FIUpload,
    'pen': FIPen,
    'tag': FITag,
    'link-out': FILinkOut,
    'link': FILink,
    'copy': FICopy,
    'flag': FIFlag,
    'next': FINext,
    'clear': FIClear,
    'date-dots': FIDateDots,
    'gift': FIGift,
    'warning': FIWarning,
    'arrow-down': FIArrowDown,
    'arrow-up': FIArrowUp,
    'arrow-left': FIArrowLeft,
    'arrow-right': FIArrowRight,
    'paperclip': FIPaperclip,
    'play': FIPlay,
    'pause': FIPause,
    'check-circle': FICheckCircle,
    'clipboard': FIClipboard,
    'time': FITime,
    'menu': FIMenu,
    'search': FISearch,
    'user': FIUser,
    'star': FIStar,
}

setFoldIcons(defaultIcons)

export type FoldApp = {
    license?: string
    theme?: string
}

export type FoldContext = {
    fold: FoldApp
    alert: AlertOptions
    setAlert: (alert: AlertOptions) => void
    dialog: DialogOptions
    setDialog: (dialog: DialogOptions) => void
    setConfig: any
}

export const FoldContext = React.createContext<FoldContext>({
    fold: {},
    alert: {},
    setAlert: () => null,
    dialog: {},
    setDialog: () => null,
    setConfig: (fold: Partial<FoldApp>) => null,
})

export type FoldProviderProps = {
    license?: string
    theme?: string
    dragOptions?: DragManagerProps
}

export const FoldProvider = (props: any) => {
    const { license, theme, dragOptions = {} } = props
    const [fold, setFold] = useState<FoldApp>({})
    const [alert, setAlert] = useState<AlertOptions>({})
    const [dialog, setDialog] = useState<DialogOptions>({})
    const { setTheme, getSystemTheme, getStoredTheme } = useTheme()

    const handleAlertDismiss = () => {
        if (alert.onDismiss) alert.onDismiss()
        setAlert({})
    }

    const setConfig = (obj: Partial<FoldApp>) => {
        if (obj.theme) setTheme(obj.theme)
        setFold({ ...fold, ...obj })
    }

    useLayoutEffect(() => {
        const theme = getStoredTheme() || getSystemTheme()
        setTheme(theme)
        setFold({ theme, license })
    }, [theme, license])

    return (
        <FoldContext.Provider
            value={{
                fold,
                alert,
                setAlert,
                dialog,
                setDialog,
                setConfig,
            }}>
            {props.children}
            <DragManager {...dragOptions} />
            <ToastContainer />
            <Alert
                alert={alert}
                onDismiss={handleAlertDismiss}
            />
        </FoldContext.Provider>
    )
}
