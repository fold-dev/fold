import React from 'react'
import { Preview } from '@storybook/react'
import { AppProvider, DarkModeToggle, Icon } from '../packages/core'
import '../packages/core/dist/styles.css'
import '../packages/pro/dist/styles.css'

export const decorators = [
    (Story, context) => {
        if (context.parameters.fold?.bare) {
            return (
                <AppProvider>
                    <Story />
                </AppProvider>
            )
        }

        return (
            <AppProvider>
                <div
                    id="mockup-dark-mode-container"
                    style={{
                        borderRadius: 20,
                        background: 'var(--f-color-surface)',
                        padding: 50,
                        margin: 50,
                        width: 'calc(100% - 100px)',
                    }}>
                    <div
                        className="f-row f-justify-start"
                        id="mockup-dark-mode-toggle"
                        style={{ paddingBottom: 20 }}>
                        <DarkModeToggle
                            size="xl"
                            darkMode={<Icon icon="dark-mode" />}
                            lightMode={<Icon icon="light-mode" />}
                        />
                    </div>
                    <Story />
                </div>
            </AppProvider>
        )
    },
]

const preview: Preview = {
    decorators,
    parameters: {
        backgrounds: {
            options: {
                default: {
                    name: 'default',
                    value: 'var(--f-color-background)',
                },
                highlight: {
                    name: 'highlight',
                    value: '#f0f3f5',
                },
                light: {
                    name: 'light',
                    value: 'var(--f-color-background)',
                },
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    initialGlobals: {
        backgrounds: { value: 'light' },
    },
}

export default preview
