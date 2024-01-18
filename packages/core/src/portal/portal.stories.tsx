import React, { useRef } from 'react'
import { Portal } from '@fold-dev/core'

export default {
    title: 'Components/Portal',
    component: Portal,
}

export const docs = {
    title: 'Portal',
    subtitle:
        'The Portal is employed to transfer any component or element to the end of the document.body and render a React tree within it.',
    description:
        'Useful for creating a seamless React element hierarchy within a distinct DOM hierarchy, preventing potential style conflicts with parent elements that might obscure or conceal content (commonly used for popovers, dropdowns, and modals). It supports custom root mounts.',
}

export const Usage = () => {
    return <Portal>Content outside of the existing DOM hierarchy</Portal>
}

// --

export const CustomRoot = () => {
    const portalRef = useRef(null)

    return (
        <>
            <div
                id="custom-root"
                ref={portalRef}
            />
            <Portal portalRef={portalRef.current}>Content in a portal, in a custom root</Portal>
        </>
    )
}
