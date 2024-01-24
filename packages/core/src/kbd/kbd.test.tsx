import { render } from '@testing-library/react'
import React from 'react'
import { Kbd } from './kbd'

describe('Kbd Component', () => {
    test('renders with the correct content', () => {
        const { getByText } = render(<Kbd>shift</Kbd>)

        expect(getByText('shift')).toBeInTheDocument()
    })
})
