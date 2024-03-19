export type MoveDirection = 'up' | 'down' | 'right' | 'left'

export type DragVariant = 'lined' | 'lined-focus' | 'focus' | 'animated'

export type DragOrigin = {
    elementId: string
    targetVariant: any
    height: number
    width: number
    areaId: string
    index: number
    group: string
}

export type DragTarget = {
    focus: boolean
    moveDirection: MoveDirection
    index: number
    indent: number
    left: number
    top: number
    height: number
    width: number
    areaId: string
    elementId: string
    group: string
}
