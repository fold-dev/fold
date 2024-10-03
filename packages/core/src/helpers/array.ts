export const addElementToArray = (array, index, element) => {
    const arr = [...array]
    arr.splice(index, 0, element)
    return arr
}

export const removeElementFromArray = (array, index) => {
    const arr = [...array]
    arr.splice(index, 1)
    return arr
}

export const getTargetIndex = (origin, target) => {
    return target.moveDirection == 'up'
        ? target.index > origin.index
            ? target.index - 1
            : target.index
        : target.moveDirection == 'down'
            ? target.index > origin.index
                ? target.index
                : target.index - 1
            : target.index
}

export const moveElementInArray = (array, origin, target) => {
    return [...arrayMove(array, origin.index, getTargetIndex(origin, target))]
}

export const arrayMove = (array, from, to) => {
    return from < to
        ? [...array.slice(0, from), ...array.slice(from + 1, to + 1), array[from], ...array.slice(to + 1)]
        : [...array.slice(0, to), array[from], ...array.slice(to, from), ...array.slice(from + 1)]
}

export const getNumberArray = (amount: number, n: number = 1): number[] => {
    return new Array(amount)
        .fill(null)
        .map((_, i) => i)
        .filter((_, i) => i % n === 0)
}

export const arrayRotateReverse = (arr, reverse) => {
    if (reverse) arr.unshift(arr.pop())
    else arr.push(arr.shift())
    return arr
}

export const arrayRotateByOne = (arr, count) => {
    let newArr = arr
    for (let c = 0; c < count; c++) {
        newArr = [...newArr.slice(1, newArr.length), newArr[0]]
    }
    return newArr
}
