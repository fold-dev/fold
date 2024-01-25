import { render } from '@testing-library/react'
import React from 'react'
import { Logo, LogoSolid } from './logo'

describe('Logo Component', () => {
    test('renders as solid version', () => {
        const { baseElement } = render(<LogoSolid />)
        expect(baseElement).toBeInTheDocument()
    })

    test('renders as outline version', () => {
        const { baseElement } = render(<Logo />)
        expect(baseElement).toBeInTheDocument()
    })
})
