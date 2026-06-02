import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface TransactionCategory {
  id:    string
  name:  string
  icon:  string | null
  color: string | null
}

export interface TransactionPaymentMethod {
  id:   string
  name: string
  type: string
}

export interface Transaction {
  id:              string
  categoryId:      string | null
  paymentMethodId: string | null
  amount:          number
  merchantName:    string
  memo:            string | null
  transactionDate: string
  createdAt:       string
  category:        TransactionCategory | null
  paymentMethod:   TransactionPaymentMethod | null
}

export interface TransactionPagination {
  page:        number
  pageSize:    number
  total:       number
  totalPages:  number
  totalAmount: number
}

export interface TransactionListParams {
  page:              number
  pageSize:          number
  startDate?:        string
  endDate?:          string
  categoryIds?:      string[]
  paymentMethodIds?: string[]
}

export interface TransactionPayload {
  merchantName:    string
  amount:          number
  categoryId?:     string | null
  paymentMethodId?: string | null
  memo?:           string
  transactionDate: string
}

export const transactionsApi = {
  getList: (params: TransactionListParams) =>
    apiClient.get<{ success: boolean; data: Transaction[]; pagination: TransactionPagination }>(
      endpoints.transactions.base,
      { params },
    ),

  getById: (id: string) =>
    apiClient.get<{ success: boolean; data: Transaction }>(endpoints.transactions.detail(id)),

  create: (payload: TransactionPayload) =>
    apiClient.post<{ success: boolean; data: Transaction }>(endpoints.transactions.base, payload),

  update: (id: string, payload: Partial<TransactionPayload>) =>
    apiClient.patch<{ success: boolean; data: Transaction }>(endpoints.transactions.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.transactions.detail(id)),
}
