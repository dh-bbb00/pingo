import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query'
import { categoriesApi } from '@/api/endpoints/categories.api'
import { queryKeys } from '@/constants/queryKeys'
import type { CategorySort } from '@/api/endpoints/categories.api'

const PAGE_SIZE = 20

export function useCategories(sort: CategorySort) {
  return useInfiniteQuery({
    queryKey: queryKeys.categories.list(sort),
    queryFn: ({ pageParam }) =>
      categoriesApi.getList({ page: pageParam, pageSize: PAGE_SIZE, sort }).then(r => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    placeholderData: keepPreviousData,
  })
}
