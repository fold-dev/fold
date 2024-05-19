import * as fs from 'fs'
import * as prettier from 'prettier'
import * as docgen from 'react-docgen-typescript'
import { ComponentDoc, PropItem } from 'react-docgen-typescript'
import { ParserOptions } from 'react-docgen-typescript/lib/parser'
import * as ts from 'typescript'

const addSpaces = (s: string) => s.replace(/([A-Z])/g, ' $1').trim()

const stripComments = (str) => str.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, '')

const parserOptions: ParserOptions = {
    savePropValueAsString: true,
    shouldIncludePropTagMap: true,
    propFilter: (prop: PropItem, component) => {
        const { name, required, type, description, defaultValue, parent, declarations, tags } = prop

        if (!declarations) return false

        const declaration = declarations[0]

        if (name.includes('aria-')) return false
        if (name == 'key') return false
        if (declaration.name == 'HTMLAttributes') return false
        if (declaration.name == 'DOMAttributes') return false
        if (declaration.name == 'AllHTMLAttributes') return false

        return component.name == 'View' ? true : !!declaration.fileName?.includes('.tsx')
    },
}

const navigation = []

const createMdxFile = (slug, stories, dependenciesText, docsText, propsText, installText, cssText, storyTypeDocs) => {
    let fileExport = ''
    fileExport += "import { CodeComponent } from '@/pages/components/code.component'\n"
    fileExport += "import DocsLayout from '@/layouts/docs.layout'\n"
    fileExport += "import ComponentLayout from '@/layouts/component.layout'\n"

    fileExport += dependenciesText + '\n\n'
    fileExport += docsText + '\n\n'
    fileExport += propsText + '\n\n'
    fileExport += cssText + '\n\n'

    if (installText) {
        fileExport += `<CodeComponent filename="${slug}.tsx" code="${Buffer.from(installText, 'utf-8').toString(
            'base64'
        )}" />\n`
        fileExport += '```tsx\n'
        fileExport += installText
        fileExport += '```\n\n'
    }

    // iterate over each story
    stories
        .filter((s) => !!s)
        .map((story) => {
            const tsComponent = stripComments(story)
            const tsComponentName = tsComponent
                .split('\n')
                .filter((l) => !!l)[0]
                .split(' ')[2]

            // compile the component to be ES6 compliant
            // this will be displayed in the codeblocks in the MDX files
            const jsComponent = ts.transpileModule(tsComponent, {
                compilerOptions: {
                    jsx: 1,
                    allowJs: true,
                    alwaysStrict: false,
                    module: 99,
                    target: 99,
                    sourceMap: false,
                    declaration: true,
                    forceConsistentCasingInFileNames: false,
                    noImplicitReturns: false,
                    noImplicitThis: false,
                    noImplicitAny: false,
                    strictNullChecks: false,
                    suppressImplicitAnyIndexErrors: true,
                    noUnusedLocals: false,
                    allowSyntheticDefaultImports: true,
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    skipLibCheck: true,
                    esModuleInterop: true,
                },
            }).outputText

            const name = tsComponentName == 'Usage' ? 'BasicUsage' : tsComponentName
            const doc: any = storyTypeDocs.find((doc) => doc.displayName == tsComponentName)
            const description = doc ? doc.description : null
            const title = doc ? (doc.tags.title ? doc.tags.title : tsComponentName) : tsComponentName
            const example = doc ? (doc.tags.example ? doc.tags.example : null) : null
            const section = title || name

            fileExport += `### ${addSpaces(section)}\n`
            // we generate these on the fly when indexing each page
            // not using <a> tags - but with id attributes
            // fileExport += `<a name="${section.toLowerCase()}"></a>\n`
            fileExport += '\n'

            if (description) fileExport += `> ${description}\n\n`

            // actual component on the page
            fileExport += jsComponent + '\n'
            fileExport += '<div className="story-block">\n'
            fileExport += `<${tsComponentName} />\n`
            fileExport += '</div>\n'
            fileExport += '\n'

            // code snippet
            if (example) {
                fileExport += `<CodeComponent filename="${name}.tsx" code="${Buffer.from(example, 'utf-8').toString(
                    'base64'
                )}" />\n`
                fileExport += example + '\n'
            } else {
                fileExport += `<CodeComponent filename="${name}.tsx" code="${Buffer.from(
                    tsComponent.trim(),
                    'utf-8'
                ).toString('base64')}" />\n`
                fileExport += '\n'
                fileExport += '```tsx\n'
                fileExport += tsComponent.trim() + '\n'
                fileExport += '```\n'
            }
        })

    fileExport += '\n'
    fileExport += `export default ({ children }) => <ComponentLayout docs={docs} props={props} css={css}>{children}</ComponentLayout>`

    fs.writeFileSync(`./docs-output/${slug}.mdx`, fileExport)
}



const generateMdx = (path) => {
    fs.readdirSync(path, { withFileTypes: true }).map(async (d) => {
        const fileName: any = d.name
        const filePath = path + '/' + d.name
        const isFile = d.isFile()
        const { resolve } = require('path')

        if (!isFile) {
            console.log(fileName)
            generateMdx(filePath)
        } else {
            // general components
            // -----------------------------
            if (
                fileName.includes('tsx') &&
                !fileName.includes('.stories') &&
                !fileName.includes('.test') &&
                !fileName.includes('fold.context')
            ) {
                return
                console.log('exporting ', fileName)

                if (!fileName.includes('drag')) return

                const slug = fileName.replace('.tsx', '')
                const componentDoc: ComponentDoc[] = docgen.parse(filePath, parserOptions)

                //console.log(fileName, componentDoc)


                return 

                // 1) export props as json
                const propsText = 'export const props = ' + JSON.stringify(componentDoc)

                // 2) start getting the data together to use in the MDX file
                // create the imports to use
                const imports = `import { ${componentDoc
                    .map(({ displayName }) => displayName)
                    .join(', ')} } from '@fold-dev/core'`
                const installText = prettier.format(imports, { parser: 'typescript' })

                // get the CSS vars (:root)
                const cssFile = resolve(filePath.replace('tsx', 'css'))
                let cssText = 'export const css = []'
                if (fs.existsSync(cssFile)) {
                    const cssFileContents = fs.readFileSync(cssFile, { encoding: 'utf8', flag: 'r' })
                    const cssBlocks = cssFileContents
                        .split('\n\n')
                        .filter((block: string) => block.includes(':root') && !!block)
                        .map((block: string) => {
                            return block
                                .split('\n')
                                .filter((line: string) => !line.includes('{') && !line.includes('}'))
                                .map((line: string) => line.trim().replace(';', '').split(': '))
                        })
                    cssText = `export const css = ${JSON.stringify(cssBlocks)}\n\n`
                }

                // parse the storyfile
                const storyFile = resolve(filePath.replace('tsx', 'stories.tsx'))

                if (fs.existsSync(storyFile)) {
                    const storyFileContents = fs.readFileSync(storyFile, { encoding: 'utf8', flag: 'r' })

                    // get all of the stories & misc. data to use as blocks
                    // the fileParts expects a certain format - check each storyfile
                    const fileParts = storyFileContents.split('\n\n').filter((chunk) => !!chunk)
                    const onlyStories = fileParts.filter((_, index) => index > 2).join('\n\n')
                    const stories = onlyStories.split('// --')
                    const module = require(storyFile)

                    // get special docs stored in the story file
                    const storyTypeDocs = docgen.parse(storyFile, parserOptions)

                    // 3) push this component to the navigation
                    navigation.push({ slug, ...module.docs })

                    // write the mdx file
                    createMdxFile(slug, stories, fileParts[0], fileParts[2], propsText, installText, cssText, storyTypeDocs)
                }
            }

            // hooks
            // -----------------------------
            if (fileName.includes('hooks')) {
                console.log('exporting ', fileName)

                const slug = fileName.replace('.stories.tsx', '')
                const storyFile = resolve(filePath.replace('tsx', 'tsx'))
                const storyFileContents = fs.readFileSync(storyFile, { encoding: 'utf8', flag: 'r' })

                // get all of the stories & misc. data to use as blocks
                // the fileParts expects a certain format - check each storyfile
                const fileParts = storyFileContents.split('\n\n').filter((chunk) => !!chunk)
                const onlyStories = fileParts.filter((_, index) => index > 2).join('\n\n')
                const stories = onlyStories.split('// --')
                const module = require(storyFile)

                // get special docs stored in the story file
                const storyTypeDocs = docgen.parse(storyFile, parserOptions)

                // don't do this step for hooks - it's manually added
                // 3) push this component to the navigation
                // navigation.push({ slug, ...module.docs })

                let installText: any = fileParts[0].split('\n')
                installText.pop()
                installText = installText.join('\n')

                // write the mdx file
                createMdxFile(
                    slug,
                    stories,
                    fileParts[0],
                    fileParts[2],
                    'export const props = []',
                    `import {
    useCacheValue,
    useCheck,
    useConnection,
    useDragging,
    useEvent,
    useFocus,
    useId,
    useInput,
    useObserver,
    usePubsub,
    useStorage,
    useTabVisibility,
    useTheme,
    useTimeout,
    useTimer,
    useVisibility,
    useWindowResize
} from '@fold-dev/core'
`,
                    'export const css = []',
                    storyTypeDocs
                )
            }
        }
    })
}

generateMdx(process.argv[2].split('=')[1])

const navigationFile = prettier.format(`export const navigation = ${JSON.stringify(navigation)}`, {
    parser: 'typescript',
})

fs.writeFileSync(`./docs-output/navigation.ts`, navigationFile)

/* 
const props: any = []

const generateProps = (path) => {
    fs.readdirSync(path, { withFileTypes: true }).map((d) => {
        const fileName = d.name
        const filePath = path + '/' + d.name
        const isFile = d.isFile()
        
        if (!isFile) {
            generateProps(filePath)
        } else {
            if (fileName.includes('accordion')) {
                if (
                    !fileName.includes('DS_Store') && 
                    !fileName.includes('.css') && 
                    !fileName.includes('.mdx') && 
                    !fileName.includes('.stories') && 
                    !fileName.includes('.test')
                ) {
                    const componentDoc: ComponentDoc[] = docgen.parse(filePath, parserOptions)

                    componentDoc.map((component: any) => {
                        const { displayName, description } = component
                        const props = Object.keys(component.props).map((key) => {
                            const { 
                                name,
                                type,
                                defaultValue, 
                                description,
                                required,
                            } = component.props[key]

                            return { 
                                name,
                                type,
                                defaultValue, 
                                description,
                                required, 
                            }
                        })      
                    })

                    props.push(componentDoc)
                }
            }
        }
    })
}

generateProps('./packages/react/src')

const data = JSON.stringify(props, null, 2)

fs.writeFileSync('./scripts/docgen/docs.json', data)
fs.writeFileSync('./packages/docs/src/mdx/v0.1/docs.json', data)
*/
