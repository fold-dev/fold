import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Text } from '../text/text'
import { View } from '../view/view'
import { Affix } from './affix'

const Usage = () => {
    return (
        <View
            position="relative"
            className="f-overflow-y-auto"
            height={300}
            radius="var(--f-radius)"
            bgToken="surface-strong">
            <Affix
                bgToken="surface-strong"
                zIndex={1}>
                {(stuck) => <Text p={20}>{stuck ? 'Content when stuck' : 'Default content'}</Text>}
            </Affix>
            <View
                height={500}
                position="relative"
                zIndex={0}>
                <Text
                    p={20}
                    size="xs"
                    fontWeight="bold"
                    colorToken="accent">
                    Scroll down inside this container.
                </Text>
            </View>
        </View>
    )
}

describe('Affix Component', () => {
    test('renders default content when not stuck', () => {
        const { getByText, queryByText } = render(<Usage />)

        // Check if the default content is rendered initially
        expect(getByText('Default content')).toBeInTheDocument()

        // Check if the content when stuck is not initially rendered
        expect(queryByText('Content when stuck')).not.toBeInTheDocument()
    })

    /* 
    https://github.com/testing-library/react-testing-library/issues/671
    test('renders content when affixed', () => {
      const { getByText, queryByText } = render(<Usage />);
      
      // Trigger the Affix to simulate being stuck
      fireEvent.scroll(window, { target: { scrollY: 300 } });

      const newRender = render(<Usage />);
  
      // Check if the content when stuck is rendered after being affixed
      expect(newRender.getByText('Content when stuck')).toBeInTheDocument();
  
      // Check if the default content is not rendered after being affixed
      expect(newRender.queryByText('Default content')).not.toBeInTheDocument();
    });
    */
})
