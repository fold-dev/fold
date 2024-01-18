export const FDate = (date: Date) => {
    const isBefore = (beforeDate: Date) => {
        return beforeDate > date
    }

    const isAfter = (afterDate: Date) => {
        return afterDate < date
    }

    const isSame = (sameDate: Date) => {
        return (
            date.getFullYear() === sameDate.getFullYear() &&
            date.getMonth() === sameDate.getMonth() &&
            date.getDate() === sameDate.getDate()
        )
    }

    const startOf = (prop: 'month' | 'week' | 'day'): Date => {
        const dateObj = new Date(date)

        switch (prop) {
            case 'month':
                return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1)
            case 'week':
                const day = dateObj.getDay()
                const diff = dateObj.getDate() - day + (day == 0 ? -6 : 1)
                return new Date(dateObj.setDate(diff))
            case 'day':
                return new Date(dateObj.setHours(0, 0, 0, 0))
            default:
                return null
        }
    }

    const endOf = (prop: 'month' | 'week' | 'day'): Date => {
        const dateObj = new Date(date)

        switch (prop) {
            case 'month':
                return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0)
            case 'week':
                const day = dateObj.getDay()
                const diff = dateObj.getDate() - day + (day == 0 ? -6 : 1)
                const start = new Date(dateObj.setDate(diff))
                return new Date(start.getDate() + 6)
            case 'day':
                return new Date(dateObj.setHours(23, 59, 59, 999))
            default:
                return null
        }
    }

    const isLastDayOfMonth = (date) => {
        const test = new Date(date)
        return date.getMonth() !== new Date().setDate(test.getDate() + 1)
    }

    const add = (value, prop: 'year' | 'month' | 'month-strict' | 'week' | 'day'): Date => {
        const dateObj = new Date(date)

        switch (prop) {
            case 'year':
                return new Date(dateObj.setFullYear(dateObj.getFullYear() + value))
            case 'month-strict':
                return new Date(dateObj.setMonth(new Date(dateObj).getMonth() + value))
            case 'month':
                if (isLastDayOfMonth(dateObj)) {
                    return new Date(
                        new Date(new Date(new Date(date).setDate(1)).setMonth(dateObj.getMonth() + value + 1)).setDate(
                            0
                        )
                    )
                } else {
                    return new Date(dateObj.setMonth(new Date(dateObj).getMonth() + value))
                }
            case 'week':
                return new Date(dateObj.setDate(dateObj.getDate() + value * 6))
            case 'day':
                return new Date(dateObj.setDate(dateObj.getDate() + value))
            default:
                return null
        }
    }

    const subtract = (value, prop: 'year' | 'month' | 'month-strict' | 'week' | 'day'): Date => {
        const dateObj = new Date(date)

        switch (prop) {
            case 'year':
                return new Date(dateObj.setFullYear(dateObj.getFullYear() - value))
            case 'month-strict':
                return new Date(dateObj.setMonth(new Date(dateObj).getMonth() - value))
            case 'month':
                if (isLastDayOfMonth(dateObj)) {
                    return new Date(
                        new Date(new Date(new Date(date).setDate(1)).setMonth(dateObj.getMonth() - value + 1)).setDate(
                            0
                        )
                    )
                } else {
                    return new Date(dateObj.setMonth(new Date(dateObj).getMonth() + value))
                }
            case 'week':
                return new Date(dateObj.setDate(dateObj.getDate() - value * 6))
            case 'day':
                return new Date(dateObj.setDate(dateObj.getDate() - value))
            default:
                return null
        }
    }

    return {
        isBefore,
        isAfter,
        isSame,
        startOf,
        endOf,
        add,
        subtract,
        isLastDayOfMonth,
    }
}

export const isDayInsideRange = (day, range) => {
    const start = range ? range[0] : null
    const end = start ? range[1] : null

    if (start) {
        if (FDate(day).isSame(start)) return true
    }

    if (end) {
        if (FDate(day).isSame(end)) return true
    }

    if (start && end) {
        if (day >= start && day <= end) return true
    }

    return false
}

export const isMonthInsideRange = (month, range) => {
    const start = range ? range[0] : null
    const end = start ? range[1] : null

    if (start) {
        if (month.getMonth() == start.getMonth() && month.getFullYear() == start.getFullYear()) return true
    }

    if (end) {
        if (month.getMonth() == end.getMonth() && month.getFullYear() == end.getFullYear()) return true
    }

    if (start && end) {
        if (month >= start && month <= end) return true
    }

    return false
}

export const isYearInsideRange = (year, range) => {
    const start = range ? range[0] : null
    const end = start ? range[1] : null

    if (start) {
        if (year.getFullYear() == start.getFullYear()) return true
    }

    if (end) {
        if (year.getFullYear() == end.getFullYear()) return true
    }

    if (start && end) {
        if (year >= start && year <= end) return true
    }

    return false
}

export const getStartAndEndOfWeek = (index) => {
    const start = Math.floor(index / 7) * 7
    const end = start + 7 - 1
    return { start, end }
}
