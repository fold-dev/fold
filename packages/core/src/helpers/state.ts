import { useEffect, useReducer, useRef } from 'react'

const create = (initStore) => {
    let state: any = {}
    let listeners = new Set()

    const setState = (partial, replace) => {
        const nextState = typeof partial === 'function' ? partial(state) : partial
        if (nextState !== state) {
            state = replace ? nextState : { ...state, ...nextState }
            listeners.forEach((listener: any) => listener(state, nextState))
        }
    }

    const getState: any = () => state

    const subscribeWithListener = (listener, selector, equalityFn = Object.is) => {
        let currentSlice = selector(state)
        function listenerToAdd() {
            const nextSlice = selector(state)
            if (!equalityFn(currentSlice, nextSlice)) {
                const previousSlice = currentSlice
                listener((currentSlice = nextSlice), previousSlice)
            }
        }
        listeners.add(listenerToAdd)
        return () => listeners.delete(listenerToAdd)
    }

    const subscribe = (listener, selector, equalityFn) => {
        if (selector || equalityFn) {
            return subscribeWithListener(listener, selector, equalityFn)
        }

        listeners.add(listener)
        return () => listeners.delete(listener)
    }

    const destroy = () => listeners.clear()

    const api = {
        setState,
        getState,
        subscribe,
        destroy,
    }

    state = initStore(setState, getState, api)
    return api
}

export const createState = (initState) => {
    const api = typeof initState === 'function' ? create(initState) : initState

    const useStore = (selector, equalityFn = Object.is) => {
        const state = api.getState()
        const stateRef = useRef(state)
        const selectorRef = useRef(selector)
        const errorRef = useRef(false)
        const equalityFnRef = useRef(equalityFn)
        const [, forceRender] = useReducer((c) => c + 1, 0)
        const currentStateSlice = useRef()

        if (!currentStateSlice.current) {
            currentStateSlice.current = selector(state)
        }

        let hasNewStateSlice
        let newStateSlice

        if (selectorRef.current !== selector || stateRef.current !== state || errorRef.current) {
            newStateSlice = selector(state)
            hasNewStateSlice = !equalityFn(newStateSlice, currentStateSlice.current)
        }

        useEffect(() => {
            if (hasNewStateSlice) currentStateSlice.current = newStateSlice

            stateRef.current = state
            selectorRef.current = selectorRef
            equalityFnRef.current = equalityFn
            errorRef.current = false
        })

        const stateBeforeListenerRef = useRef(state)

        useEffect(() => {
            function listener() {
                try {
                    const nextState = api.getState()
                    const nextStateSlice = selectorRef.current(nextState)

                    if (!equalityFnRef.current(nextStateSlice, currentStateSlice.current)) {
                        stateRef.current = nextState
                        currentStateSlice.current = nextStateSlice
                        forceRender()
                    }
                } catch (e) {
                    errorRef.current = true
                    forceRender()
                }
            }

            const unsubscribe = api.subscribe(listener)
            if (api.getState() !== stateBeforeListenerRef.current) listener()

            return unsubscribe
        }, [])

        return hasNewStateSlice ? newStateSlice : currentStateSlice.current
    }

    Object.assign(useStore, api)
    return useStore
}

/*

Not used for now:

export const useDragState = createState((set, get) => ({
    target: {} as DragTarget,
    origin: { targetVariant: {} } as DragOrigin,
    setTarget: (target: DragTarget) => set((state) => ({ ...state, target })),
    setOrigin: (origin: DragOrigin) => set((state) => ({ ...state, origin })),
}))

const { setTarget, target, setOrigin, origin } = useDragState((state: any) => state)

*/
