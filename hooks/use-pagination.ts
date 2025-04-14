import { useState, useMemo } from 'react'

export function usePagination<T>(items: T[], defaultPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return items.slice(start, end)
  }, [items, currentPage, pageSize])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    // Reset to first page when changing page size
    setCurrentPage(1)
  }

  return {
    currentPage,
    pageSize,
    paginatedItems,
    handlePageChange,
    handlePageSizeChange
  }
}