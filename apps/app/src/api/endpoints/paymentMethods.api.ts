import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse, ListResponse } from '@/api/types'

export type PaymentMethodType = 'CASH' | 'GIFT_CARD' | 'CARD'

export interface PaymentMethod {
  id:         string
  type:       PaymentMethodType
  name:       string
  cardNumber: string | null
  isDefault:  boolean
  createdAt:  string
}

export const paymentMethodsApi = {
  getList: () =>
    apiClient.get<ListResponse<PaymentMethod>>(endpoints.paymentMethods.base),

  create: (payload: { name: string; cardNumber?: string; isDefault?: boolean }) =>
    apiClient.post<BasicResponse<PaymentMethod>>(endpoints.paymentMethods.base, payload),

  update: (id: string, payload: { name?: string; isDefault?: boolean }) =>
    apiClient.patch<BasicResponse<PaymentMethod>>(endpoints.paymentMethods.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.paymentMethods.detail(id)),
}
