import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { FixedExpenseDetail } from '@/screens/more/fixedExpenses/types'

export type { FixedExpenseDetail as FixedExpense }

export interface CreateFixedExpensePayload {
  merchantName:    string
  amount:          number
  categoryId?:     string
  paymentMethodId?: string
  memo?:           string
  dayOfMonth:      number
  isActive?:       boolean
}

export const fixedExpensesApi = {
  getList: () =>
    apiClient.get<{ success: boolean; data: FixedExpenseDetail[] }>(endpoints.fixedExpenses.base),

  create: (payload: CreateFixedExpensePayload) =>
    apiClient.post<{ success: boolean; data: FixedExpenseDetail }>(endpoints.fixedExpenses.base, payload),

  update: (id: string, payload: Partial<CreateFixedExpensePayload>) =>
    apiClient.patch<{ success: boolean; data: FixedExpenseDetail }>(endpoints.fixedExpenses.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.fixedExpenses.detail(id)),
}
