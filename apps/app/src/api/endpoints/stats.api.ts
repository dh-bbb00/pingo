import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

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

export const statsApi = {
  getHomeSummary: () =>
    apiClient.get<{ success: boolean; data: HomeSummary }>(endpoints.stats.homeSummary),

  getByCategory: (params: StatsParams) =>
    apiClient.get<{ success: boolean; data: ByCategoryResult }>(endpoints.stats.byCategory, { params }),

  getByDate: (params: StatsParams) =>
    apiClient.get<{ success: boolean; data: ByDateResult[] }>(endpoints.stats.byDate, { params }),

  getByMonth: (params: StatsParams) =>
    apiClient.get<{ success: boolean; data: ByMonthResult[] }>(endpoints.stats.byMonth, { params }),

  getByHour: (params: StatsParams) =>
    apiClient.get<{ success: boolean; data: ByHourResult[] }>(endpoints.stats.byHour, { params }),
}
