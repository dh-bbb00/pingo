import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import {
  schedulerLogsApi,
  type SchedulerLogStatus,
  type SchedulerLogType,
  type GetLogsParams,
} from '@/api/endpoints/schedulerLogs.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'
import { strings } from '@/constants/strings'

const PAGE_SIZE = 20

type TabType = 'all' | 'success' | 'failure' | 'notRun'

function tabToStatusFilter(tab: TabType): SchedulerLogStatus | undefined {
  if (tab === 'success') return 'SUCCESS'
  if (tab === 'failure') return 'FAILURE'
  return undefined
}

/** 이번 달 스케줄러 실행 현황 */
export function useCurrentMonthStatus() {
  return useQuery({
    queryKey: queryKeys.schedulerLogs.currentMonth,
    queryFn:  async () => {
      const res = await schedulerLogsApi.getCurrentMonthStatus()
      return res.data.data
    },
  })
}

/** 스케줄러 로그 무한 스크롤 목록 */
export function useSchedulerLogs(tab: TabType, year?: number, month?: number) {
  const params: GetLogsParams = {
    pageSize: PAGE_SIZE,
    year,
    month,
    status: tab !== 'notRun' ? tabToStatusFilter(tab) : undefined,
  }

  return useInfiniteQuery({
    queryKey: queryKeys.schedulerLogs.list({ tab, year, month }),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await schedulerLogsApi.getLogs({ ...params, page: pageParam as number })
      return res.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    enabled: tab !== 'notRun',
  })
}

/** 미실행(NOT_RUN) 항목 목록 */
export function useSchedulerNotRun(year?: number, month?: number) {
  return useQuery({
    queryKey: queryKeys.schedulerLogs.notRun({ year, month }),
    queryFn:  async () => {
      const res = await schedulerLogsApi.getNotRun(year, month)
      return res.data.data
    },
  })
}

/** 로그 단건 조회 */
export function useSchedulerLogDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.schedulerLogs.detail(id),
    queryFn:  async () => {
      const res = await schedulerLogsApi.getById(id)
      return res.data.data
    },
    enabled: !!id,
  })
}

/** 전체 수동 실행 뮤테이션 */
export function useRunMonthlyScheduler() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => schedulerLogsApi.runMonthly(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedulerLogs.all })
      Toast.show({ type: 'success', text1: strings.schedulerManagement.runSuccess })
    },
    onError: (error) => handleApiError(error),
  })
}

/** 타입별 단독 수동 실행 뮤테이션 */
export function useRunSchedulerByType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ type, year, month }: { type: SchedulerLogType; year?: number; month?: number }) =>
      schedulerLogsApi.runByType(type, year, month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedulerLogs.all })
      Toast.show({ type: 'success', text1: strings.schedulerManagement.runSuccess })
    },
    onError: (error) => handleApiError(error),
  })
}
