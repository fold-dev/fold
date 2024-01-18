import React, { ReactElement } from 'react'

export const rotate = (x, y, angle) => {
    return {
        x: x * Math.cos(angle) - y * Math.sin(angle),
        y: x * Math.sin(angle) + y * Math.cos(angle),
    }
}

export const positionDOMElement = (x, y, r, el, callback) => {
    el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`
    callback()
}

export const resizeDOMElement = (width, height, el) => {
    el.style.width = width + 'px'
    el.style.height = height + 'px'
}

export const selectText = (element) => {
    const range = document.createRange()
    range.selectNode(element)
    windowObject.getSelection().removeAllRanges()
    windowObject.getSelection().addRange(range)
}

export const replaceAll = (str, replaceWhat, replaceTo) => {
    const re = new RegExp(replaceWhat, 'g')
    return str.replace(re, replaceTo)
}

export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max)
}

export const pad = (number, max = 10) => (number < max ? '0' + number : number)

export type GlobalCursor = 'col' | 'row' | 'grabbing'

export const globalCursor = {
    add: (cursor: GlobalCursor) => addDocumentClass('f-cursor-' + cursor),
    remove: (cursor: GlobalCursor) => removeDocumentClass('f-cursor-' + cursor),
}

export const addDocumentClass = (className: string) => documentObject.body.classList.add(className)

export const removeDocumentClass = (className: string) => documentObject.body.classList.remove(className)

export const scrollToCenter = (target: HTMLElement) => {
    const container = target?.parentElement
    if (container) {
        container.scrollTo({
            behavior: 'smooth',
            top: target.offsetTop - (container.offsetHeight / 2 - target.offsetHeight / 2),
        })
    }
}

export function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
    return (value) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(value)
            } else if (ref != null) {
                ;(ref as React.MutableRefObject<T | null>).current = value
            }
        })
    }
}

export const isClient: boolean = typeof window != 'undefined'

export const shortenNames = (names: string[]) => names.map((name) => name.split(' ')[0]).join(', ')

export let windowObject: Window | any =
    typeof window === 'undefined'
        ? {
              FOLD_ICONS: {},
              FOLD_DRAG_CACHE: {},
              FOLD_DRAG_STATE: {},
              AudioContext: null,
              webkitAudioContext: null,
              devicePixelRatio: null,
              innerWidth: 0,
              innerHeight: 0,
              outerWidth: 0,
              outerHeight: 0,
              fetch: () => null,
              addEventListener: (event, handler, passive = null) => null,
              removeEventListener: (event, handler, passive = null) => null,
              dispatchEvent: (event) => null,
              matchMedia: (media) => ({ matches: false }),
              getSelection: () => {},
              clipboardData: null,
          }
        : window

export let documentObject: Document | any =
    typeof window === 'undefined'
        ? {
              elementFromPoint: (x, y) => null,
              querySelectorAll: (s) => [],
              querySelector: (s) => {},
              activeElement: null,
              documentElement: {
                  setAttribute: (attr) => null,
                  getAttribute: (attr) => null,
                  scrollTop: 0,
                  style: {},
              },
              body: {
                  dataset: {},
                  scrollTop: 0,
                  appendChild: (el) => null,
                  style: {
                      removeProperty: (a) => null,
                      setProperty: (a, b, c) => null,
                  },
                  classList: {
                      toggle: (className) => null,
                      add: (className) => null,
                      remove: (className) => null,
                  },
              },
              execCommand: (cmd) => null,
              createElement: (tag): any => {},
              createRange: (tag): any => {},
              getElementsByTagName: (tag) => [null],
              getElementById: (id) => ({ scrollIntoView: (params) => null }),
          }
        : document

export const focusInputAtEnd = (el) => {
    el.focus()

    executeLast(() => {
        const { type, value } = el
        const end = value.length
        if (type != 'number') el.setSelectionRange(end, end)
    })
}

export const checkParentNodesForId = (el, id) => {
    let found = false
    while (el.parentNode) {
        el = el.parentNode
        if (el.id === id) {
            found = true
            return null
        } else {
            return el
        }
    }
    return found
}

export const executeLast = (cb, delay = 100) => setTimeout(cb, delay)

export const getLetterArray = (value: string, size: number): string[] => {
    const arr = new Array(size).fill('')
    const values = value?.split('')
    return arr.map((a, i) => (!!values[i] ? values[i] : a))
}

export const getOffsetToRoot = (el) => {
    let top = 0
    let left = 0

    if (el.offsetParent) {
        do {
            top += el.offsetTop
            left += el.offsetLeft
            el = el.offsetParent
        } while (el)
    }

    return { top, left }
}

export const getOffset = (element) => {
    return {
        width: element?.offsetWidth,
        height: element?.offsetHeight,
        left: element?.offsetLeft,
        top: element?.offsetTop,
        parent: element?.offsetParent,
    }
}

export const isBoxOffScreen = ({ top, left, width, height }) => {
    const x = left + width > windowObject.innerWidth
    const y = top + height > windowObject.innerHeight
    return { x, y }
}

export const isOffScreen = (el: HTMLElement) => {
    if (!el) return { x: false, y: false }

    const { innerWidth, innerHeight } = windowObject
    const { x, y, width, height } = el.getBoundingClientRect()

    return {
        offscreenX: x + width > innerWidth,
        offscreenY: y + height > innerHeight,
    }
}

export const isOffScreenCoordinates = (rect: any) => {
    const x = rect.x + rect.width > windowObject.innerWidth
    const y = rect.y + rect.height > windowObject.innerHeight
    return { x, y }
}

export const getButton = (e) => {
    const { button } = e

    return {
        isLeftButton: button == 0,
        isMiddleButton: button == 1,
        isRightButton: button == 2,
        isBackButton: button == 3,
        isForwardButton: button == 4,
    }
}

export const getKey = (e) => {
    const { keyCode } = e
    const { shiftKey, ctrlKey, altKey, metaKey } = e

    return {
        isBackspace: keyCode == 8,
        isEscape: keyCode == 27,
        isSpace: keyCode == 32,
        isEnter: keyCode == 13,
        isDown: keyCode == 40,
        isUp: keyCode == 38,
        isLeft: keyCode == 37,
        isRight: keyCode == 39,
        isPageUp: keyCode == 33,
        isPageDown: keyCode == 34,
        isTab: keyCode == 9,
        isTabNormal: keyCode == 9 && !shiftKey,
        isTabReverse: keyCode == 9 && shiftKey,
        isShift: shiftKey,
        isCntrl: ctrlKey,
        isAlt: altKey,
        isMeta: metaKey,
    }
}

export const getValidObject = (obj: any) => {
    return obj ? { ...obj } : {}
}

export const getPercent = (n: number) => {
    return Math.ceil(n * 100)
}

export const getPropsByString = (props: any, str: string) => {
    let ariaObject = {}
    Object.keys(props)
        .filter((key: string) => key.includes(str))
        .map((key: string) => {
            ariaObject[key] = props[key]
        })
    return cleanObject(ariaObject)
}

export const renderChildren = (children: any, callback: any) => {
    return React.Children.map(children, callback)
}

export const renderWithProps = (children: any, props: any) => {
    return React.Children.map(children, (child: ReactElement, index) => {
        return React.cloneElement(child, {
            ...child.props,
            ...props,
        })
    })
}

export const classNames = (object: any, classes: string[] = []): string => {
    const classList = classes.filter((c) => !!c)
    const classArray = []
    for (const property in object) {
        if (!!object[property]) classArray.push(property)
    }
    const allClasses = [...classList, ...classArray].join(' ')
    return !!allClasses ? allClasses : null
}

export const focusElement = (el: HTMLElement) => el?.focus()

export const blurElement = (el: HTMLElement) => el?.blur()

export const getBoundingClientRect = (element) => {
    if (!element) return {}
    const { top, right, bottom, left, width, height, x, y } = element.getBoundingClientRect()
    return { top, right, bottom, left, width, height, x, y }
}

export const formatCSSDimension = (value: any) => {
    return isNaN(value) ? value : value + 'px'
}

export const generateUEID = () => {
    const prefix = 'f-'
    const first = (Math.random() * 46656) | 0
    const second = (Math.random() * 46656) | 0
    return prefix + (first + second)
}

export const getAlignClass = (variant: string) => {
    return variant ? `f-align-${variant}` : null
}

export const getPopoutClass = (variant: string) => {
    return variant ? `f-popout-${variant}` : null
}

export const getActionClass = (variant: string) => {
    return variant ? `is-${variant}` : null
}

export const getMimeTypeDescription = (type: string) => {
    switch (type) {
        case 'audio/aac':
            return 'AAC audio'
        case 'application/x-abiword':
            return 'AbiWorddocument'
        case 'application/x-freearc':
            return 'Archive document (multiple files embedded)'
        case 'video/x-msvideo':
            return 'AVI: Audio Video Interleave'
        case 'application/vnd.amazon.ebook':
            return 'Amazon Kindle eBook format'
        case 'application/octet-stream':
            return 'Any kind of binary data'
        case 'image/bmp':
            return 'Windows OS/2 Bitmap Graphics'
        case 'application/x-bzip':
            return 'BZip archive'
        case 'application/x-bzip2':
            return 'BZip2 archive'
        case 'application/x-csh':
            return 'C-Shell script'
        case 'text/css':
            return 'Cascading Style Sheets (CSS)'
        case 'text/csv':
            return 'Comma-separated values (CSV)'
        case 'application/msword':
            return 'Microsoft Word'
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'Microsoft Word (OpenXML)'
        case 'application/vnd.ms-fontobject':
            return 'MS Embedded OpenType fonts'
        case 'application/epub+zip':
            return 'Electronic publication (EPUB)'
        case 'application/gzip':
            return 'GZip Compressed Archive'
        case 'image/gif':
            return 'Graphics Interchange Format (GIF)'
        case 'text/html':
            return 'HyperText Markup Language (HTML)'
        case 'image/vnd.microsoft.icon':
            return 'Icon format'
        case 'text/calendar':
            return 'iCalendar format'
        case 'application/java-archive':
            return 'Java Archive (JAR)'
        case 'image/jpeg':
            return 'JPEG images'
        case 'text/javascript':
            return 'JavaScript'
        case 'application/json':
            return 'JSON format'
        case 'application/ld+json':
            return 'JSON-LD format'
        case 'audio/midiaudio/x-midi':
            return 'Musical Instrument Digital Interface (MIDI)'
        case 'audio/mpeg':
            return 'MP3 audio'
        case 'video/mpeg':
            return 'MPEG Video'
        case 'application/vnd.apple.installer+xml':
            return 'Apple Installer Package'
        case 'application/vnd.oasis.opendocument.presentation':
            return 'OpenDocument presentation document'
        case 'application/vnd.oasis.opendocument.spreadsheet':
            return 'OpenDocument spreadsheet document'
        case 'application/vnd.oasis.opendocument.text':
            return 'OpenDocument text document'
        case 'audio/ogg':
            return 'OGG audio'
        case 'video/ogg':
            return 'OGG video'
        case 'application/ogg':
            return 'OGG'
        case 'audio/opus':
            return 'Opus audio'
        case 'font/otf':
            return 'OpenType font'
        case 'image/png':
            return 'Portable Network Graphics'
        case 'application/pdf':
            return 'AdobePortable Document Format(PDF)'
        case 'appliction/php':
            return 'Hypertext Preprocessor (Personal Home Page)'
        case 'application/vnd.ms-powerpoint':
            return 'Microsoft PowerPoint'
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'Microsoft PowerPoint (OpenXML)'
        case 'application/x-rar-compressed':
            return 'RAR archive'
        case 'application/rtf':
            return 'Rich Text Format (RTF)'
        case 'application/x-sh':
            return 'Bourne shell script'
        case 'image/svg+xml':
            return 'Scalable Vector Graphics (SVG)'
        case 'application/x-shockwave-flash':
            return 'Small web format(SWF) or Adobe Flash document'
        case 'application/x-tar':
            return 'Tape Archive (TAR)'
        case 'image/tiff':
            return 'Tagged Image File Format (TIFF)'
        case 'video/mp2t':
            return 'MPEG transport stream'
        case 'font/ttf':
            return 'TrueType Font'
        case 'text/plain':
            return 'Text'
        case 'application/vnd.visio':
            return 'Microsoft Visio'
        case 'audio/wav':
            return 'Waveform Audio Format'
        case 'audio/webm':
            return 'WEBM audio'
        case 'video/webm':
            return 'WEBM video'
        case 'video/mp4':
            return 'Video File'
        case 'image/webp':
            return 'WEBP image'
        case 'font/woff':
            return 'Web Open Font Format (WOFF)'
        case 'font/woff2':
            return 'Web Open Font Format (WOFF)'
        case 'application/xhtml+xml':
            return 'XHTML'
        case 'application/vnd.ms-excel':
            return 'Microsoft Excel'
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'Microsoft Excel (OpenXML)'
        case 'application/xmlifnotreadable from casual users (RFC 3023':
            return ' section 3)'
        case 'text/xmlif readable from casual users':
            return 'XML'
        case 'application/vnd.mozilla.xul+xml':
            return 'XUL'
        case 'application/zip':
            return 'ZIP archive'
        case "audio/3gppif it doesn't contain video":
            return '3GPPaudio/video container'
        case "audio/3gpp2if it doesn't contain video":
            return '3GPP2audio/video container'
        case 'application/x-7z-compressed':
            return '7-ziparchive'
        default:
            return 'Document'
    }
}

export const cleanObject = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

export const mapBetween = (currentNum, minAllowed, maxAllowed, min, max) => {
    return ((maxAllowed - minAllowed) * (currentNum - min)) / (max - min) + minAllowed
}

export const range = (start, end) => {
    let length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
}

export const styleGhostElement = (element, { top, left, width, height }) => {
    element.style.boxShadow = '0px 15px 25px -4px rgba(150, 150, 150, 0.24)'
    element.style.position = 'fixed'
    element.style.pointerEvents = 'none'
    element.style.zIndex = 500
    element.style.transform = 'rotate(5deg)'
    element.style.transition = 'none'
    element.style.width = width
    element.style.height = height
    element.style.top = top
    element.style.left = left

    element.className = 'draggable dragging'
}

export const cache = {
    set: (key: string, value: any) => {
        if (window) window[key] = value
    },
    delete: (key: string) => {
        if (window) delete window[key]
    },
    get: (key: string) => {
        return window ? window[key] : null
    },
}

export const bytesToSize = (bytes: number): string => {
    if (bytes == null) return null
    const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb']
    if (bytes == 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) + '', 10)
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

export const urlParser = (url: string): string[] => {
    if (!url) return []
    if (typeof url != 'string') return []

    const match = url.match(/(http[s]?:\/\/.*)/i)
    return match ? match[0].split(' ') : []
}

export const logger = function (a?): void {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        for (const argument of arguments) {
            console.log(argument)
        }
    }
}

export const removeNullProperties = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

export const timezones = [
    'Antarctica/Palmer',
    'Antarctica/Rothera',
    'Antarctica/Syowa',
    'Antarctica/Troll',
    'Antarctica/Vostok',
    'America/Argentina/Buenos_Aires',
    'America/Argentina/Cordoba',
    'America/Argentina/Salta',
    'America/Argentina/Jujuy',
    'America/Argentina/Tucuman',
    'America/Argentina/Catamarca',
    'America/Argentina/La_Rioja',
    'America/Argentina/San_Juan',
    'America/Argentina/Mendoza',
    'America/Argentina/San_Luis',
    'America/Argentina/Rio_Gallegos',
    'America/Argentina/Ushuaia',
    'Pacific/Pago_Pago',
    'Europe/Vienna',
    'Australia/Lord_Howe',
    'Antarctica/Macquarie',
    'Australia/Hobart',
    'Australia/Currie',
    'Australia/Melbourne',
    'Australia/Sydney',
    'Australia/Broken_Hill',
    'Australia/Brisbane',
    'Australia/Lindeman',
    'Australia/Adelaide',
    'Australia/Darwin',
    'Australia/Perth',
    'Australia/Eucla',
    'Asia/Baku',
    'America/Barbados',
    'Asia/Dhaka',
    'Europe/Brussels',
    'Europe/Sofia',
    'Atlantic/Bermuda',
    'Asia/Brunei',
    'America/La_Paz',
    'America/Noronha',
    'America/Belem',
    'America/Fortaleza',
    'America/Recife',
    'America/Araguaina',
    'America/Maceio',
    'America/Bahia',
    'America/Sao_Paulo',
    'America/Campo_Grande',
    'America/Cuiaba',
    'America/Santarem',
    'America/Porto_Velho',
    'America/Boa_Vista',
    'America/Manaus',
    'America/Eirunepe',
    'America/Rio_Branco',
]

export const waitForRender = (cb, t = 0) => setTimeout(cb, t)
