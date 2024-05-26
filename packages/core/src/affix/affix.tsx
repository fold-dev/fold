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
    const className = classNames(
        {
            'f-affix': true,
            'is-stuck': stuck,
        },
        [props.className]
    )

    useEffect(() => {
        setTimeout(() => {
            const cachedRef = containerRef.current
            const observer = new IntersectionObserver(([e]) => setStuck(e.intersectionRatio < 1), {
                threshold: [1],
            })
            observer.observe(cachedRef)

            return () => observer.unobserve(cachedRef)
        }, 10)
    }, [])

    return (
        <View
            {...rest}
            className={className}
            ref={mergeRefs([containerRef, ref])}>
            {children(stuck)}
        </View>
    )
})
