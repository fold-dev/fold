import { windowObject } from '../helpers'
import { FOLD_DRAG_STATE } from './drag-manager'

export const getPreviousNextElements = (targetIndex, targetElement, moveDirection) => {
    const { origin } = windowObject[FOLD_DRAG_STATE]
    const originIndex = origin.index
    const parent = targetElement.parentNode

    let previous = parent.children[targetIndex - 1]
    let next = parent.children[targetIndex]

    if (next) {
        if (moveDirection == 'down' && originIndex == +next.dataset.index) {
            next = parent.children[targetIndex + 1]
        }

        if (next.dataset.placeholder) {
            next = undefined
        }
    }

    if (previous) {
        if (moveDirection == 'up' && originIndex == +previous.dataset.index) {
            previous = parent.children[targetIndex - 2]
        }
    }

    return { previous, next }
}
