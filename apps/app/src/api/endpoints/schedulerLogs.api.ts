import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

// ─── 타입 ───────────────────────────────────────────
export type SchedulerLogType = 'BUDGET_ROLLOVER' | 'FIXED_EXPENSES' | 'INSTALLMENTS'
export type SchedulerTrigger = 'CRON' | 'MANUAL'

export interface SchedulerLog {
  id:           string
  type:         SchedulerLogType
  year:         number
  month:        number
  runAt:        string
  success:      boolean
  totalCount:   number
  successCount: number
  error:        string | null
  triggeredBy:  SchedulerTrigger
}

/** 이번 달 현황 — 타입별 최신 로그 또는 null */
export interface CurrentMonthStatusItem {
  type: SchedulerLogType
  log:  SchedulerLog | null
}

/** 미실행 항목 */
export interface NotRunEntry {
  type:  SchedulerLogType
  year:  number
  month: number
}

/** 전체 수동 실행 결과 */
export interface RunMonthlyResult {
  budgets:      number
  fixedExpenses: number
  installments:  number
}

/** 타입별 수동 실행 결과 */
export interface RunByTypeResult {
  totalCount:   number
  successCount: number
}

// ─── API 응답 래퍼 ──────────────────────────────────
interface BasicResponse<T>  { success: boolean; data: T }
interface PageResponse<T>   {
  success: boolean
  data: T[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

// ─── 쿼리 파라미터 ──────────────────────────────────
export interface GetLogsParams {
  page?:     number
  pageSize?: number
  type?:     SchedulerLogType
  success?:  boolean
  year?:     number
  month?:    number
}

export const schedulerLogsApi = {
  /** 수동 실행 */
  runMonthly: () =>
    apiClient.post<BasicResponse<RunMonthlyResult>>(endpoints.scheduler.runMonthly),

  /** 로그 목록 (페이지네이션) */
  getLogs: (params?: GetLogsParams) =>
    apiClient.get<PageResponse<SchedulerLog>>(endpoints.scheduler.logs, { params }),

  /** 이번 달 실행 현황 */
  getCurrentMonthStatus: () =>
    apiClient.get<BasicResponse<CurrentMonthStatusItem[]>>(endpoints.scheduler.currentMonth),

  /** 미실행 항목 목록 */
  getNotRun: (year?: number, month?: number) =>
    apiClient.get<BasicResponse<NotRunEntry[]>>(endpoints.scheduler.notRun, {
      params: { year, month },
    }),

  /** 타입별 단독 수동 실행 */
  runByType: (type: SchedulerLogType) =>
    apiClient.post<BasicResponse<RunByTypeResult>>(endpoints.scheduler.runByType(type)),

  /** 단건 조회 */
  getById: (id: string) =>
    apiClient.get<BasicResponse<SchedulerLog>>(endpoints.scheduler.logDetail(id)),
}
