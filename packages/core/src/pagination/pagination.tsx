import React, { useMemo } from 'react'
import { CoreViewProps, IconLib, Text, View } from '../'
import { classNames, range } from '../helpers'

export const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage, separator }) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize)
        const totalPageNumbers = siblingCount + 5

        if (totalPageNumbers >= totalPageCount) return range(1, totalPageCount)

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

        const shouldShowLeftDots = leftSiblingIndex > 2
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

        const firstPageIndex = 1
        const lastPageIndex = totalPageCount

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount
            let leftRange = range(1, leftItemCount)

            return [...leftRange, separator, totalPageCount]
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)
            return [firstPageIndex, separator, ...rightRange]
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex)
            return [firstPageIndex, separator, ...middleRange, separator, lastPageIndex]
        }

        return null
    }, [totalCount, pageSize, siblingCount, currentPage])

    return paginationRange
}

export type PaginationProps = {
    onPageChange: any
    siblingCount: number
    pageSize: number
    currentPage: number
    totalCount: number
    separator?: string
} & CoreViewProps

export const Pagination = (props: PaginationProps) => {
    const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, separator = '...', ...rest } = props
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
        separator,
    })

    if (currentPage === 0 || paginationRange.length < 2) {
        return null
    }

    const onNext = () => {
        onPageChange(currentPage + 1)
    }

    const onPrevious = () => {
        onPageChange(currentPage - 1)
    }

    let lastPage = paginationRange[paginationRange.length - 1]

    return (
        <View
            {...rest}
            as="ul"
            className="f-pagination f-row">
            <li
                onClick={onPrevious}
                className={classNames({
                    'f-pagination__item': true,
                    'is-disabled': currentPage === 0,
                    'is-button': true,
                })}>
                <IconLib icon="chevron-left" />
            </li>

            {paginationRange.map((pageNumber: any, index: number) => {
                if (pageNumber === separator)
                    return (
                        <li
                            className="f-pagination__item dots"
                            key={index}>
                            <Text>{separator}</Text>
                        </li>
                    )

                return (
                    <li
                        key={index}
                        onClick={() => onPageChange(pageNumber)}
                        className={classNames({
                            'f-pagination__item': true,
                            'is-selected': pageNumber === currentPage,
                        })}>
                        <Text>{pageNumber}</Text>
                    </li>
                )
            })}

            <li
                onClick={onNext}
                className={classNames({
                    'f-pagination__item': true,
                    'is-disabled': currentPage === lastPage,
                    'is-button': true,
                })}>
                <IconLib icon="chevron-right" />
            </li>
        </View>
    )
}
