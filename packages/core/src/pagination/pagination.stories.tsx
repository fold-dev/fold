import { Pagination } from '@fold-dev/core'
import React, { useState } from 'react'

export default {
    title: 'Components/Pagination',
    component: Pagination,
}

export const docs = {
    title: 'Pagination',
    subtitle: 'The Pagination component indicates the current page and facilitates navigation among other pages.',
    description:
        'Pagination is a frequently employed technique for facilitating user navigation across multiple pages. However, it may not be suitable in cases where lazy loading is implemented or when the user requires access to all content.',
}

export const Usage = () => {
    const [page, setPage] = useState(1)

    return (
        <Pagination
            width={500}
            pageSize={5}
            totalCount={1023}
            currentPage={page}
            siblingCount={4}
            separator="..."
            onPageChange={(page) => setPage(page)}
        />
    )
}
