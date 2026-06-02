import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/api/endpoints/categories.api'
import { queryKeys } from '@/constants/queryKeys'

export function useCategoriesAll() {
  return useQuery({
    queryKey: [...queryKeys.categories.all, 'flat'] as const,
    queryFn: () =>
      categoriesApi.getList({ page: 1, pageSize: 200, sort: 'name_asc' }).then(r => r.data.data),
  })
}
