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

export const statsApi = {
  getHomeSummary: () =>
    apiClient.get<{ success: boolean; data: HomeSummary }>(endpoints.stats.homeSummary),
}
