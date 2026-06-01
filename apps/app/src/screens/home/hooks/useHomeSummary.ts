import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/api/endpoints/stats.api'
import { queryKeys } from '@/constants/queryKeys'

export function useHomeSummary() {
  return useQuery({
    queryKey: queryKeys.stats.homeSummary(),
    queryFn:  async () => {
      const r = await statsApi.getHomeSummary()
      return r.data.data
    },
  })
}
