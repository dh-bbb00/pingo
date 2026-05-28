import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/api/endpoints/categories.api'
import { queryKeys } from '@/constants/queryKeys'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const res = await categoriesApi.getList()
      return res.data
    },
  })
}
