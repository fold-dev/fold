import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
    stories: [
        '../packages/core/src/**/*.stories.tsx',
        '../packages/core/src/**/*.mdx',
    ],
    addons: [
        '@storybook/addon-links', 
        '@storybook/addon-essentials', 
        '@storybook/addon-interactions'
    ],
    webpackFinal: async (config: any) => {
      config.resolve.extensions.push(".ts", ".tsx")
      return config
    },
    framework: {
        name: '@storybook/react-webpack5',
        options: {
            strictMode: true
        },
    },
    docs: {
        autodocs: 'tag',
    },
    babel: async (options: any) => {
        options.presets.push('@babel/preset-typescript')
        return options
    },
    staticDirs: ['../public'],
    features: {},
}
export default config
