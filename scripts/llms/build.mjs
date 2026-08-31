import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const docgen = require('react-docgen-typescript')
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectDirectory = resolve(scriptDirectory, '..', '..')
const coreDirectory = join(projectDirectory, 'packages', 'core')
const coreSourceDirectory = join(coreDirectory, 'src')
const designDirectory = join(projectDirectory, 'packages', 'design')
const outputDirectoryArgumentIndex = process.argv.indexOf('--output-dir')
const outputDirectoryArgument =
    outputDirectoryArgumentIndex === -1 ? null : process.argv[outputDirectoryArgumentIndex + 1]

if (outputDirectoryArgumentIndex !== -1 && !outputDirectoryArgument) {
    throw new Error('Expected a directory after --output-dir')
}

const publicDirectory = outputDirectoryArgument
    ? resolve(projectDirectory, outputDirectoryArgument)
    : join(projectDirectory, 'public')
const corePackage = JSON.parse(readFileSync(join(coreDirectory, 'package.json'), 'utf8'))
const designPackage = JSON.parse(readFileSync(join(designDirectory, 'package.json'), 'utf8'))

const parserOptions = {
    savePropValueAsString: true,
    shouldIncludePropTagMap: true,
    propFilter: (property, component) => {
        const declaration = property.declarations?.[0]
        if (!declaration) return false
        if (property.name.includes('aria-') || property.name === 'key') return false
        if (['HTMLAttributes', 'DOMAttributes', 'AllHTMLAttributes'].includes(declaration.name)) return false
        return component.name === 'View' || Boolean(declaration.fileName?.includes('.tsx'))
    },
}

const cleanText = (value = '') =>
    value
        .replace(/<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()

const escapeTableCell = (value) =>
    String(value ?? '')
        .replace(/\|/g, '\\|')
        .replace(/\s+/g, ' ')
        .trim()

const titleCase = (value) =>
    value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')

const extractBalanced = (source, marker, openingCharacter, closingCharacter) => {
    const markerIndex = source.indexOf(marker)
    if (markerIndex === -1) return null

    const startIndex = source.indexOf(openingCharacter, markerIndex + marker.length)
    if (startIndex === -1) return null

    let depth = 0
    let quote = null
    let escaped = false

    for (let index = startIndex; index < source.length; index += 1) {
        const character = source[index]

        if (quote) {
            if (escaped) escaped = false
            else if (character === '\\') escaped = true
            else if (character === quote) quote = null
            continue
        }

        if (character === '"' || character === "'" || character === '`') quote = character
        else if (character === openingCharacter) depth += 1
        else if (character === closingCharacter) {
            depth -= 1
            if (depth === 0) return { value: source.slice(startIndex, index + 1), endIndex: index + 1 }
        }
    }

    return null
}

const parseDocs = (source) => {
    const literal = extractBalanced(source, 'export const docs =', '{', '}')
    if (!literal) return { docs: {}, endIndex: 0 }

    try {
        return { docs: Function(`"use strict"; return (${literal.value})`)(), endIndex: literal.endIndex }
    } catch {
        return { docs: {}, endIndex: literal.endIndex }
    }
}

const parseExamples = (source, docsEndIndex) => {
    const defaultExportIndex = source.indexOf('export default')
    const imports = defaultExportIndex === -1 ? '' : source.slice(0, defaultExportIndex).trim()
    const examples = source
        .slice(docsEndIndex)
        .split(/^\s*\/\/ --\s*$/m)
        .map((chunk) => {
            const exportIndex = chunk.search(/export const\s+[A-Za-z0-9_$]+/)
            if (exportIndex === -1) return null

            const commentIndex = chunk.lastIndexOf('/**', exportIndex)
            const startIndex = commentIndex === -1 ? exportIndex : commentIndex
            const code = chunk.slice(startIndex).trim()
            const name = code.match(/export const\s+([A-Za-z0-9_$]+)/)?.[1] ?? 'Example'
            return { name, code }
        })
        .filter(Boolean)

    return { imports, examples }
}

const parseCssVariables = (filePath) => {
    if (!existsSync(filePath)) return []
    const source = readFileSync(filePath, 'utf8')
    return [
        ...new Map(
            [...source.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)].map((match) => [match[1], match[2].trim()])
        ).entries(),
    ]
}

const getComponentDocs = (indexPath) => {
    if (!existsSync(indexPath)) return []
    try {
        return docgen.parse(indexPath, parserOptions)
    } catch (error) {
        console.warn(`Could not generate props from ${indexPath}: ${error.message}`)
        return []
    }
}

const components = readdirSync(coreSourceDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
        const slug = entry.name
        const directory = join(coreSourceDirectory, slug)
        const storyPath = join(directory, `${slug}.stories.tsx`)
        if (!existsSync(storyPath)) return null

        const source = readFileSync(storyPath, 'utf8')
        const { docs, endIndex } = parseDocs(source)

        return {
            slug,
            title: cleanText(docs.title) || titleCase(slug),
            subtitle: cleanText(docs.subtitle),
            description: cleanText(docs.description),
            experimental: Boolean(docs.experimental),
            componentDocs: getComponentDocs(join(directory, 'index.ts')),
            cssVariables: parseCssVariables(join(directory, `${slug}.css`)),
            ...parseExamples(source, endIndex),
        }
    })
    .filter(Boolean)
    .sort((left, right) => left.title.localeCompare(right.title))

const renderProps = (componentDocs) => {
    if (!componentDocs.length) return ''

    return `## Public components and props

${componentDocs
    .map((component) => {
        const properties = Object.values(component.props ?? {})
        const description = cleanText(component.description)
        const lines = [`### ${component.displayName}`]

        if (description) lines.push('', description)
        if (!properties.length) return lines.join('\n')

        lines.push('', '| Prop | Type | Required | Default | Description |')
        lines.push('| --- | --- | --- | --- | --- |')

        for (const property of properties) {
            const defaultValue =
                property.defaultValue?.value ?? property.defaultValue ?? property.tags?.defaultValue ?? ''
            lines.push(
                `| \`${escapeTableCell(property.name)}\` | \`${escapeTableCell(property.type?.name)}\` | ${
                    property.required ? 'Yes' : 'No'
                } | ${escapeTableCell(defaultValue) || '—'} | ${
                    escapeTableCell(cleanText(property.description)) || '—'
                } |`
            )
        }

        return lines.join('\n')
    })
    .join('\n\n')}
`
}

const renderCssVariables = (variables) => {
    if (!variables.length) return ''
    return `## CSS variables

| Variable | Default |
| --- | --- |
${variables.map(([name, value]) => `| \`${escapeTableCell(name)}\` | \`${escapeTableCell(value)}\` |`).join('\n')}
`
}

const renderExamples = ({ imports, examples }) => {
    if (!examples.length) return ''
    return `## Examples

Examples may reference local fixture data from the Fold repository; replace those fixtures with application data.

${imports ? `### Imports\n\n\`\`\`tsx\n${imports}\n\`\`\`\n\n` : ''}${examples
        .map(({ name, code }) => `### ${name}\n\n\`\`\`tsx\n${code}\n\`\`\``)
        .join('\n\n')}
`
}

const renderComponent = (component) => `# ${component.title}

> ${component.subtitle || `Fold Core ${component.title} component reference.`}

- Package: \`@fold-ui/core@${corePackage.version}\`
- Import public APIs from: \`@fold-ui/core\`
${component.experimental ? '- Status: Beta\n' : ''}
${component.description}

${renderProps(component.componentDocs)}
${renderCssVariables(component.cssVariables)}
${renderExamples(component)}
`

const renderCore = () => `# Fold Core

> Component-oriented documentation for \`@fold-ui/core\`, generated from the existing Storybook stories, React prop metadata, and component CSS.

- Version: \`${corePackage.version}\`
- React peer dependency: \`${corePackage.peerDependencies.react}\`
- Source: [github.com/fold-ui/fold](https://github.com/fold-ui/fold)

## Installation and setup

\`\`\`bash
npm install @fold-ui/core
\`\`\`

\`\`\`tsx
import { AppProvider } from '@fold-ui/core'
import '@fold-ui/core/dist/styles.css'

export function App() {
    return <AppProvider>{/* application */}</AppProvider>
}
\`\`\`

Import public APIs from the package root. Use documented props and CSS variables instead of guessing names or importing internal source paths.

## Component index

${components.map((component) => `- ${component.title}: ${component.subtitle || component.description}`).join('\n')}

${components.map(renderComponent).join('\n\n---\n\n')}
`

const renderTokenTable = (title, variables) => `## ${title}

| Token | Value |
| --- | --- |
${variables.map(([name, value]) => `| \`${escapeTableCell(name)}\` | \`${escapeTableCell(value)}\` |`).join('\n')}
`

const renderDesign = () => {
    const systemTokens = parseCssVariables(join(designDirectory, 'tokens.css'))
    const lightTokens = parseCssVariables(join(designDirectory, 'tokens-light.css'))
    const darkTokens = parseCssVariables(join(designDirectory, 'tokens-dark.css'))

    return `# Fold Design

> Resolved design tokens and theming guidance for \`@fold-ui/design\`.

- Version: \`${designPackage.version}\`
- Source: [github.com/fold-ui/fold/tree/main/packages/design/tokens](https://github.com/fold-ui/fold/tree/main/packages/design/tokens)

The Core stylesheet already includes the system, light, and dark Design token files. Install Design directly when consuming tokens without Core or when building a custom theme.

## JavaScript usage

\`\`\`tsx
import * as Token from '@fold-ui/design/tokens'
import { ColorBlue400 } from '@fold-ui/design/tokens-es6'
\`\`\`

## CSS and themes

\`\`\`css
@import '@fold-ui/design/tokens.css';
@import '@fold-ui/design/tokens-light.css';
@import '@fold-ui/design/tokens-dark.css';

.example {
    color: var(--f-color-text);
    padding: var(--f-space-4);
    border-radius: var(--f-radius);
}
\`\`\`

Set \`data-theme="light"\` or \`data-theme="dark"\` on the root element, or use Core's \`useTheme\` hook. Override theme variables after the Fold stylesheet.

${renderTokenTable('System tokens', systemTokens)}
${renderTokenTable('Light theme tokens', lightTokens)}
${renderTokenTable('Dark theme tokens', darkTokens)}
`
}

const renderIndex = () => `# Fold UI

> A TypeScript and React UI kit with Core components and a shared Design token system.

Use these generated references as the source of truth for package setup, component props, examples, CSS variables, and design tokens. Pro is intentionally excluded while its APIs are under active development.

## Documentation

- [Core components](./llms-core.txt): Component descriptions, prop tables, CSS variables, and examples for \`@fold-ui/core\`.
- [Design tokens](./llms-design.txt): Resolved tokens and theming guidance for \`@fold-ui/design\`.
- [Complete reference](./llms-full.txt): Core and Design combined for clients with large context windows.

## Optional

- [Fold documentation](https://fold-ui.com/docs): Human guides and interactive component examples.
- [GitHub repository](https://github.com/fold-ui/fold): Source code and issue tracker.
`

const coreReference = renderCore()
const designReference = renderDesign()
const generatedNotice = '<!-- Generated by npm run build:llms. Do not edit directly. -->'

mkdirSync(publicDirectory, { recursive: true })

writeFileSync(join(publicDirectory, 'llms.txt'), `${renderIndex().trimEnd()}\n`)
writeFileSync(join(publicDirectory, 'llms-core.txt'), `${generatedNotice}\n\n${coreReference.trimEnd()}\n`)
writeFileSync(join(publicDirectory, 'llms-design.txt'), `${generatedNotice}\n\n${designReference.trimEnd()}\n`)
writeFileSync(
    join(publicDirectory, 'llms-full.txt'),
    `${generatedNotice}\n\n# Fold UI complete reference\n\n${coreReference.trimEnd()}\n\n---\n\n${designReference.trimEnd()}\n`
)

console.log(
    `Generated LLM documentation for ${components.length} Core component areas and Design tokens in ${publicDirectory}.`
)
