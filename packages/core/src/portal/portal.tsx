import { documentObject } from '../helpers'
import React from 'react'
import ReactDOM from 'react-dom'

export class Portal extends React.Component {
    el: HTMLElement
    props: any

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

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return <>{ReactDOM.createPortal(this.props.children, this.el)}</>
    }
}
