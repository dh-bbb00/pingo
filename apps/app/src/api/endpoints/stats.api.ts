import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse, ListResponse } from '@/api/types'

export interface HomeSummaryCategory {
  category: { id: string; name: string; icon: string; color: string } | null
  amount:   number
  ratio:    number
  budget:   number | null
}

export interface HomeSummaryTransaction {
  id:              string
  amount:          number
  merchantName:    string
  memo:            string | null
  transactionDate: string
  categoryId:      string | null
  paymentMethodId: string | null
  category:        { id: string; name: string; icon: string | null; color: string | null } | null
  paymentMethod:   { id: string; name: string; type: string } | null
}

export interface HomeSummary {
  thisMonthTotal:     number
  lastMonthTotal:     number
  byCategory:         HomeSummaryCategory[]
  recentTransactions: HomeSummaryTransaction[]
  monthlyTrend:       { month: string; amount: number }[]
}

export interface StatsParams {
  startDate:       string
  endDate:         string
  categoryId?:     string
  paymentMethodId?: string
}

export interface CategoryStatItem {
  category: { id: string; name: string; icon: string; color: string } | null
  amount:   number
  ratio:    number
}

export interface ByCategoryResult {
  total:      number
  byCategory: CategoryStatItem[]
}

export interface ByDateResult {
  date:   string
  amount: number
}

export interface ByMonthResult {
  month:  string
  amount: number
}

export interface ByHourResult {
  hour:   number
  amount: number
}

export interface Top10Item {
  id:              string
  merchantName:    string
  amount:          number
  memo:            string | null
  transactionDate: string
  category:      { id: string; name: string; icon: string; color: string } | null
  paymentMethod: { id: string; name: string; type: string } | null
}

export type StatsMainTab = 'period' | 'category' | 'paymentMethod'
export type StatsDateTab = '일' | '월' | '년' | '기간'

export const DATE_TAB = {
  DAY:   '일',
  MONTH: '월',
  YEAR:  '년',
  RANGE: '기간',
} as const satisfies Record<string, StatsDateTab>

export interface StatsFilter {
  mainTab:                 StatsMainTab
  dateTab:                 StatsDateTab
  date:                    Date
  rangeStart:              Date
  rangeEnd:                Date
  selectedCategoryId:      string | null
  selectedPaymentMethodId: string | null
}

export const statsApi = {
  getHomeSummary: () =>
    apiClient.get<BasicResponse<HomeSummary>>(endpoints.stats.homeSummary),

  getByCategory: (params: StatsParams) =>
    apiClient.get<BasicResponse<ByCategoryResult>>(endpoints.stats.byCategory, { params }),

  getByDate: (params: StatsParams) =>
    apiClient.get<ListResponse<ByDateResult>>(endpoints.stats.byDate, { params }),

  getByMonth: (params: StatsParams) =>
    apiClient.get<ListResponse<ByMonthResult>>(endpoints.stats.byMonth, { params }),

  getByHour: (params: StatsParams) =>
    apiClient.get<ListResponse<ByHourResult>>(endpoints.stats.byHour, { params }),

  getTop10: (params: StatsParams) =>
    apiClient.get<ListResponse<Top10Item>>(endpoints.stats.top10, { params }),
}
