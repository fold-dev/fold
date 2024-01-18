import { useLayoutEffect, useState } from 'react'

export function useObserver(element: HTMLElement) {
    const [mutationRecord, setMutationRecord] = useState<MutationRecord>(null)

    const callback = (mutationList, observer) => {
        mutationList.forEach((mutation: MutationRecord) => {
            switch (mutation.type) {
                case 'attributes':
                    setMutationRecord(mutation)
                    break
            }
        })
    }

    useLayoutEffect(() => {
        const observer = new MutationObserver(callback)
        observer.observe(element, { attributes: true })
    }, [])

    return mutationRecord
}
