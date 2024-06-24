import { windowObject } from '../helpers'
import { FOLD_DRAG_STATE } from './drag-manager'
import { FOLD_GHOST_ELEMENT_ROTATION } from './drag.hook'

export const getPreviousNextElements = (targetIndex, targetElement, moveDirection) => {
    const { origin } = windowObject[FOLD_DRAG_STATE]
    const originIndex = origin.index
    const parent = targetElement.parentNode

    let previous = parent.children[targetIndex - 1]
    let next = parent.children[targetIndex]

    if (!!next) {
        if (moveDirection == 'down' && originIndex == +next.dataset.index) {
            next = parent.children[targetIndex + 1]
        }

        if (next.dataset.placeholder) {
            next = undefined
        }
    } else {
        next = undefined
    }

    if (!!previous) {
        if (moveDirection == 'up' && originIndex == +previous.dataset.index) {
            previous = parent.children[targetIndex - 2]
        }
    } else {
        previous = undefined
    }

    return { previous, next }
}

export const positionDOMElement = (x, y, el, callback) => {
    const rotation = windowObject[FOLD_GHOST_ELEMENT_ROTATION] || '2deg'
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rotation})`
    callback()
}
