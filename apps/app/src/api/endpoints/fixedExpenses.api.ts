import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface FixedExpense {
  id: string
  name: string
  amount: number
  categoryId: string
  billingDay: number
}

export const fixedExpensesApi = {
  getList: () =>
    apiClient.get<FixedExpense[]>(endpoints.fixedExpenses.base),

  create: (payload: Omit<FixedExpense, 'id'>) =>
    apiClient.post<FixedExpense>(endpoints.fixedExpenses.base, payload),

  update: (id: string, payload: Partial<FixedExpense>) =>
    apiClient.patch<FixedExpense>(endpoints.fixedExpenses.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.fixedExpenses.detail(id)),
}
