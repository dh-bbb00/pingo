import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface MonthlyStats {
  year: number
  month: number
  totalIncome: number
  totalExpense: number
  byCategory: { categoryId: string; amount: number }[]
}

export const statsApi = {
  getMonthly: (year: number, month: number) =>
    apiClient.get<MonthlyStats>(endpoints.stats.base, { params: { year, month } }),
}
