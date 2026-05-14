import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/api/endpoints/categories.api'
import { queryKeys } from '@/constants/queryKeys'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoriesApi.getList().then((r) => r.data),
  })
}
