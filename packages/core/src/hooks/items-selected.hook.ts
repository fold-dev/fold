import { useState } from 'react'
import { dispatchPubsub, usePubsub } from './pubsub.hook'

/**
 * This is not listed in the public docs
 */

let itemsSelectedState: any = {}

export const setItemsSelected = (data) => {
    itemsSelectedState = { ...data }
    dispatchPubsub('items-selected-state', data)
}

export const getItemsSelected = (): any => {
    const [_, render] = useState(new Date())
    usePubsub('items-selected-state', (data: any) => render(new Date()))
    return itemsSelectedState
}
