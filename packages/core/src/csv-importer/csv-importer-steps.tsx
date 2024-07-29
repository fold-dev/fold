import React, { useContext } from 'react'
import { CsvImporterContext, Heading, Step, Steps, Text, View } from '../'

export type CsvImporterStepsProps = {
    step: number
}

export const CsvImporterSteps = (props: CsvImporterStepsProps) => {
    const { step } = props
    const {
        error,
        options: {
            text: { steps },
        },
    } = useContext(CsvImporterContext)

    return (
        <View
            column
            width="100%"
            gap="1rem">
            <Steps width="100%">
                <Step
                    next={step == 0}
                    completed={step > 0}
                    indicator={<Text>1</Text>}>
                    <Heading as="h4">{steps.one.title}</Heading>
                    <Text size="sm">{steps.one.description}</Text>
                </Step>
                <Step
                    next={step == 1}
                    completed={step > 1}
                    indicator={<Text>2</Text>}>
                    <Heading as="h4">{steps.two.title}</Heading>
                    <Text size="sm">{steps.two.description}</Text>
                </Step>
                <Step
                    next={step == 2}
                    completed={step > 2}
                    indicator={<Text>3</Text>}>
                    <Heading as="h4">{steps.three.title}</Heading>
                    <Text size="sm">{steps.three.description}</Text>
                </Step>
                <Step
                    next={step == 3}
                    completed={step > 3}
                    indicator={<Text>4</Text>}>
                    <Heading as="h4">{steps.four.title}</Heading>
                    <Text size="sm">{steps.four.description}</Text>
                </Step>
            </Steps>
        </View>
    )
}
