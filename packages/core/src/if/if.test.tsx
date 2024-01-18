import { render } from '@testing-library/react'
import React from 'react'
import { View } from '../view/view'
import { If } from './if'

describe('If Component', () => {
    test('renders visible and not visible content based on conditions', () => {
        const { getByText, queryByText } = render(
            <View>
                <If if={true}>This is visible...</If>
                <If if={false}>...and this is not visible.</If>
            </View>
        )

        // Check if the visible content is rendered
        expect(getByText('This is visible...')).toBeInTheDocument()

        // Check if the not visible content is not rendered
        expect(queryByText('...and this is not visible.')).toBeNull()
    })
})
