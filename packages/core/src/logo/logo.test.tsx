import { render } from '@testing-library/react'
import React from 'react'
import { Logo, LogoOutline } from './logo'

describe('Logo Component', () => {
    test('renders as outline version', () => {
        const { baseElement } = render(<LogoOutline />)
        expect(baseElement).toBeInTheDocument()
    })

    test('renders as outline version', () => {
        const { baseElement } = render(<Logo />)
        expect(baseElement).toBeInTheDocument()
    })
})
