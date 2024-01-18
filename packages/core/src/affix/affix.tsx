import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { View } from '..'
import { classNames, mergeRefs } from '../helpers'
import { CoreViewProps } from '../types'

export type AffixProps = {
    children: (stuck: boolean) => React.ReactNode
} & Omit<CoreViewProps, 'children'>

export const Affix = forwardRef((props: AffixProps, ref) => {
    const { children, ...rest } = props
    const containerRef = useRef(null)
    const [stuck, setStuck] = useState(false)
    const observerRef = useRef(null)
    const className = classNames(
        {
            'f-affix': true,
            'is-stuck': stuck,
        },
        [props.className]
    )

    const handleIntersection = (entries) => setStuck(entries[0].intersectionRatio < 1)

    useEffect(() => {
        observerRef.current = new IntersectionObserver(handleIntersection, { threshold: [1] })
    }, [])

    useEffect(() => {
        observerRef.current.observe(containerRef.current)
        return () => observerRef.current.disconnect()
    })

    return (
        <View
            {...rest}
            className={className}
            ref={mergeRefs([containerRef, ref])}>
            {children(stuck)}
        </View>
    )
})
