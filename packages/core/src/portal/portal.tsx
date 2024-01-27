import { documentObject } from '../helpers'
import React, { ReactElement, ReactNode, Ref } from 'react'
import ReactDOM from 'react-dom'

export type PortalProps = {
    portalRef?: HTMLDivElement
    children?: ReactElement
}

export class Portal extends React.Component<PortalProps, any> {
    el: HTMLElement
    props: any
    state: any

    constructor(props) {
        super(props)

        if (!props.portalRef) {
            const portalId: string = 'fold-portal'
            const el: HTMLElement = documentObject.getElementById(portalId)

            if (el) {
                this.el = el
            } else {
                const newEl = documentObject.createElement('div')
                newEl.setAttribute('id', portalId)
                documentObject.body.appendChild(newEl)
                this.el = newEl
            }
        } else {
            this.el = props.portalRef
        }
    }

    render() {
        return (
            <>
                {ReactDOM.createPortal(this.props.children, this.el)}
            </>
        )
    }
}
