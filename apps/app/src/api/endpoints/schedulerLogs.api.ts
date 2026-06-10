import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

// ─── 타입 ───────────────────────────────────────────
export type SchedulerLogType   = 'BUDGET_ROLLOVER' | 'FIXED_EXPENSES' | 'INSTALLMENTS'
export type SchedulerTrigger   = 'CRON' | 'MANUAL'
export type SchedulerLogStatus = 'NOT_RUN' | 'SUCCESS' | 'FAILURE'

export interface SchedulerLog {
  id:           string
  type:         SchedulerLogType
  year:         number
  month:        number
  status:       SchedulerLogStatus
  runAt:        string | null        // NOT_RUN 상태에서는 null
  totalCount:   number | null        // NOT_RUN 상태에서는 null
  successCount: number | null        // NOT_RUN 상태에서는 null
  error:        string | null
  triggeredBy:  SchedulerTrigger | null  // NOT_RUN 상태에서는 null
}

/** 이번 달 현황 — 타입별 최신 로그 또는 null */
export interface CurrentMonthStatusItem {
  type: SchedulerLogType
  log:  SchedulerLog | null
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
  status?:   SchedulerLogStatus
  year?:     number
  month?:    number
}

export const schedulerLogsApi = {
  /** 수동 실행 */
  runMonthly: () =>
    apiClient.post<BasicResponse<RunMonthlyResult>>(endpoints.scheduler.runMonthly),

  /** 로그 목록 (페이지네이션) — NOT_RUN은 기본 제외 */
  getLogs: (params?: GetLogsParams) =>
    apiClient.get<PageResponse<SchedulerLog>>(endpoints.scheduler.logs, { params }),

  /** 이번 달 실행 현황 */
  getCurrentMonthStatus: () =>
    apiClient.get<BasicResponse<CurrentMonthStatusItem[]>>(endpoints.scheduler.currentMonth),

  /** 미실행(NOT_RUN) 항목 목록 */
  getNotRun: (year?: number, month?: number) =>
    apiClient.get<BasicResponse<SchedulerLog[]>>(endpoints.scheduler.notRun, {
      params: { year, month },
    }),

  /** 타입별 단독 수동 실행 (year/month 미지정 시 현재 월) */
  runByType: (type: SchedulerLogType, year?: number, month?: number) =>
    apiClient.post<BasicResponse<RunByTypeResult>>(endpoints.scheduler.runByType(type), null, {
      params: { year, month },
    }),

  /** 단건 조회 */
  getById: (id: string) =>
    apiClient.get<BasicResponse<SchedulerLog>>(endpoints.scheduler.logDetail(id)),
}
