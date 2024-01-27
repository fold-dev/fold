import React, { useRef, useState } from 'react'
import { Button, Portal, Text, View, documentObject } from '@fold-dev/core'

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
    const [show, setShow] = useState(false)
    const portalRef = useRef(null)
    
    return (
        <>
            <Button onClick={() => setShow(!show)}>Toggle Portal</Button>

            <View
                p="1rem 0 0 0"
                id="custom-root"
                ref={portalRef}
            />

            {show && (
                <Portal portalRef={portalRef.current}>
                    <Text>Content in a portal, in a custom root</Text>
                </Portal>
            )}
        </>
    )
}
