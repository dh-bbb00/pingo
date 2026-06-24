import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse, ListResponse } from '@/api/types'

export interface FixedExpenseDetail {
  id:              string
  merchantName:    string
  amount:          number
  categoryId:      string | null
  paymentMethodId: string | null
  memo:            string | null
  dayOfMonth:      number
  isActive:        boolean
  category:        { id: string; name: string; icon: string; color: string } | null
  paymentMethod:   { id: string; name: string; type: string } | null
}

export type FixedExpensesViewTab = '리스트' | '달력'

export interface FixedExpenseForm {
  merchantName:    string
  amount:          string
  categoryId:      string | null
  paymentMethodId: string
  memo:            string
  dayOfMonth:      string
  isActive:        boolean
}

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
    apiClient.get<ListResponse<FixedExpenseDetail>>(endpoints.fixedExpenses.base),

  create: (payload: CreateFixedExpensePayload) =>
    apiClient.post<BasicResponse<FixedExpenseDetail>>(endpoints.fixedExpenses.base, payload),

  update: (id: string, payload: Partial<CreateFixedExpensePayload>) =>
    apiClient.patch<BasicResponse<FixedExpenseDetail>>(endpoints.fixedExpenses.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.fixedExpenses.detail(id)),

  getThisMonthStatus: (id: string) =>
    apiClient.get<BasicResponse<{ registered: boolean }>>(endpoints.fixedExpenses.thisMonthStatus(id)),

  registerThisMonth: (id: string) =>
    apiClient.post<BasicResponse<unknown>>(endpoints.fixedExpenses.registerThisMonth(id)),
}
