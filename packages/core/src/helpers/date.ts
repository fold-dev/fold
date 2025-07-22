import { plural } from './util'

export const FDate = (date: Date) => {
    const toISOWithTimezone = () => {
        const offset = date.getTimezoneOffset()
        const adjustedDate = new Date(date.getTime() - (offset * 60000))
        return adjustedDate.toISOString()
    }

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

    const isToday = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === today.getTime()
    }

    const isTomorrow = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === tomorrow.getTime()
    }

    const isYesterday = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === yesterday.getTime()
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

    const fromNow = () => {
        const isPast = new Date().getTime() - date.getTime() > 0
        const timeDifference = isPast ? new Date().getTime() - date.getTime() : date.getTime() - new Date().getTime()
        const seconds = Math.floor(timeDifference / 1000)
        const years = Math.floor(seconds / 31536000)
        const months = Math.floor(seconds / 2592000)
        const days = Math.floor(seconds / 86400)
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor(seconds / 60)

        if (days > 548) {
            return isPast
                ? `${years} ${plural(years, 'year')} ago`
                : `in ${years} ${plural(years, 'year')}`
        }

        if (days >= 320 && days <= 547) {
            return isPast ? 'a year ago' : 'in a year'
        }

        if (days >= 45 && days <= 319) {
            return isPast
                ? `${months} ${plural(months, 'month')} ago`
                : `in ${months} ${plural(months, 'month')}`
        }

        if (days >= 26 && days <= 45) {
            return isPast ? 'a month ago' : 'in a month'
        }

        if (hours >= 36 && days <= 25) {
            return isPast
                ? `${days} ${plural(days, 'day')} ago`
                : `in ${days} ${plural(days, 'day')}`
        }

        if (hours >= 22 && hours <= 35) {
            return isPast ? 'a day ago' : 'in a day'
        }

        if (minutes >= 90 && hours <= 21) {
            return isPast
                ? `${hours} ${plural(hours, 'hour')} ago`
                : `in ${hours} ${plural(hours, 'hour')}`
        }

        if (minutes >= 45 && minutes <= 89) {
            return isPast ? 'an hour ago' : 'in an hour'
        }

        if (seconds >= 90 && minutes <= 44) {
            return isPast
                ? `${minutes} ${plural(minutes, 'minute')} ago`
                : `in ${minutes} ${plural(minutes, 'minute')}`
        }

        if (seconds >= 45 && seconds <= 89) {
            return isPast ? 'a minute ago' : 'in a minute'
        }

        if (seconds >= 0 && seconds <= 45) {
            return isPast ? 'a few seconds ago' : 'in a few seconds'
        }
    }

    return {
        toISOWithTimezone,
        isBefore,
        isAfter,
        isSame,
        isToday,
        isTomorrow,
        isYesterday,
        startOf,
        endOf,
        add,
        subtract,
        isLastDayOfMonth,
        fromNow,
    }
}

export const roundToDay = (ts) => Math.round(ts / 1000 / 60 / 60 / 24)

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

export const sameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}
