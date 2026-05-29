import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/api/endpoints/categories.api'
import { queryKeys } from '@/constants/queryKeys'

export function useCategoryById(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id ?? ''),
    queryFn:  async () => {
      const res = await categoriesApi.getOne(id!)
      return res.data.data
    },
    enabled: !!id,
  })
}
