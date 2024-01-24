import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Accordion, AccordionHeading, AccordionItem, AccordionPanel } from './accordion'

const Usage = () => (
    <Accordion>
        <AccordionItem>
            <AccordionHeading>Benefits of using an accordion</AccordionHeading>
            <AccordionPanel data-testid="one">
                Accordions reduce clutter & keep users from getting overwhelmed by letting them focus on the information
                at hand.
            </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
            <AccordionHeading>Typical places to use an accordion</AccordionHeading>
            <AccordionPanel data-testid="two">
                FAQ sections, nested navigational items, product information section & content with simple hierarchy.
            </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
            <AccordionHeading>When to avoid using accordions</AccordionHeading>
            <AccordionPanel data-testid="three">
                When the user needs access to all of the content on the page, when there is too little content & when
                the hierarchy of the content is complex.
            </AccordionPanel>
        </AccordionItem>
    </Accordion>
)

describe('Accordion Component', () => {
    test('renders accordion with correct headings', () => {
        const { getByText, getByTestId } = render(<Usage />)

        expect(getByText('Benefits of using an accordion')).toBeInTheDocument()
        expect(getByText('Typical places to use an accordion')).toBeInTheDocument()
        expect(getByText('When to avoid using accordions')).toBeInTheDocument()
    })

    test('initially renders accordion panels as collapsed', () => {
        const { getByText, getByTestId } = render(<Usage />)

        // Ensure that the accordion panels are initially collapsed
        expect(getByTestId('one')).toBeVisible()
        expect(getByTestId('two')).toBeVisible()
        expect(getByTestId('three')).toBeVisible()
    })

    test('expands and collapses accordion panels on click', () => {
        const { getByText, getByTestId } = render(<Usage />)

        // Click on accordion headings to expand and collapse panels
        fireEvent.click(getByText('Benefits of using an accordion'))
        expect(getByTestId('one')).toBeVisible()

        fireEvent.click(getByText('Typical places to use an accordion'))
        expect(getByTestId('one')).toBeVisible()

        fireEvent.click(getByText('When to avoid using accordions'))
        expect(getByTestId('three')).toBeVisible()
    })
})
