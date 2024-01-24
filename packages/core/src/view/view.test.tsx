import React from 'react'
import { render } from '@testing-library/react'
import { View } from './view'

describe('View Component', () => {
    test('renders with the correct content and styles', () => {
        const { getByText, getByTestId } = render(
            <View
                p={50}
                bgToken="surface-strong"
                data-testid="view-component">
                Welcome to Fold!
            </View>
        )

        // TODO: Cover more shorthand style types
        expect(getByText('Welcome to Fold!')).toBeInTheDocument()
        expect(getByTestId('view-component')).toHaveStyle('padding: 50px')
        expect(getByTestId('view-component')).toHaveStyle('background-color: var(--surface-strong)')
    })
})
