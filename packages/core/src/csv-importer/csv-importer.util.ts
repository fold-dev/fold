/*
 * https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
 */
export const CSVtoArray1 = (text, separator = ',') => {
    let re_valid =
        /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/
    let re_value =
        /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g

    if (separator == ';') {
        re_valid =
            /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*(?:;\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*)*$/
        re_value =
            /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^;'"\s\\]*(?:\s+[^;'"\s\\]+)*))\s*(?:;|$)/g
    }

    if (!re_valid.test(text)) console.log(re_valid.test(text), text)

    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null

    const a = [] // Initialize array to receive values.

    text.replace(
        re_value, // "Walk" the string using replace with callback.
        function (m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"))
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'))
            else if (m3 !== undefined) a.push(m3)
            return '' // Return empty string.
        }
    )

    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('')

    return a
}

export const columnSortFunc = (index, type) => {
    switch (type) {
        case 'string':
            return (a, b) => a[index].value.localeCompare(b[index].value)
            break
        case 'number':
            return (a, b) => +a[index].value - +b[index].value
            break
        case 'date':
            return (a, b) => new Date(a[index].value).getTime() - new Date(b[index].value).getTime()
            break
    }
}

export const CSVtoArray = (strData, separator = ',') => {
    const objPattern =
        separator == ','
            ? new RegExp('(\\,|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\,\\r\\n]*))', 'gi')
            : new RegExp('(\\;|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\;\\r\\n]*))', 'gi')
    let arrMatches = null,
        arrData = [[]]
    while ((arrMatches = objPattern.exec(strData))) {
        if (arrMatches[1].length && arrMatches[1] !== ',') arrData.push([])
        arrData[arrData.length - 1].push(
            arrMatches[2] ? arrMatches[2].replace(new RegExp('""', 'g'), '"') : arrMatches[3]
        )
    }
    return arrData
}
