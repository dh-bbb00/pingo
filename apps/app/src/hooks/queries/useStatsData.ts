import { useQuery } from '@tanstack/react-query'
import { statsApi, type StatsParams } from '@/api/endpoints/stats.api'
import { queryKeys } from '@/constants/queryKeys'

export function useStatsByCategory(params: StatsParams | null) {
  return useQuery({
    queryKey:  queryKeys.stats.byCategory(params),
    queryFn:   () => statsApi.getByCategory(params!).then(r => r.data.data),
    enabled:   !!params,
    staleTime: 60_000,
  })
}

export function useStatsByDate(params: StatsParams | null) {
  return useQuery({
    queryKey:  queryKeys.stats.byDate(params),
    queryFn:   () => statsApi.getByDate(params!).then(r => r.data.data),
    enabled:   !!params,
    staleTime: 60_000,
  })
}

export function useStatsByMonth(params: StatsParams | null) {
  return useQuery({
    queryKey:  queryKeys.stats.byMonth(params),
    queryFn:   () => statsApi.getByMonth(params!).then(r => r.data.data),
    enabled:   !!params,
    staleTime: 60_000,
  })
}

export function useStatsByHour(params: StatsParams | null) {
  return useQuery({
    queryKey:  queryKeys.stats.byHour(params),
    queryFn:   () => statsApi.getByHour(params!).then(r => r.data.data),
    enabled:   !!params,
    staleTime: 60_000,
  })
}

export function useStatsTop10(params: StatsParams | null) {
  return useQuery({
    queryKey:  queryKeys.stats.top10(params),
    queryFn:   () => statsApi.getTop10(params!).then(r => r.data.data),
    enabled:   !!params,
    staleTime: 60_000,
  })
}
