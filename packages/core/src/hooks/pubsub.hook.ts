import { useEffect, useState } from 'react'

export class PubsubService {
    static instance
    listeners = {}

    constructor() {}

    static getInstance() {
        if (this.instance) return this.instance
        this.instance = new PubsubService()
        return this.instance
    }

    publish(eventName: string, payload: any) {
        if (!this.listeners[eventName]) return
        this.listeners[eventName].forEach((callback) => callback(payload))
    }

    subscribe(eventName: string, callback: any) {
        if (!this.listeners[eventName]) this.listeners[eventName] = new Set()
        this.listeners[eventName].add(callback)
    }

    unsubscribe(eventName: string, callback: any) {
        this.listeners[eventName].delete(callback)
    }
}

export const dispatchPubsub = (eventName: string, data: any) => {
    PubsubService.getInstance().publish(eventName, data)
}

export const usePubsub = (eventName: string, handler: any) => {
    useEffect(() => {
        PubsubService.getInstance().subscribe(eventName, handler)
        return () => PubsubService.getInstance().unsubscribe(eventName, handler)
    })
}
