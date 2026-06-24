import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse } from '@/api/types'

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
  id:                    string
  categoryId:            string | null
  paymentMethodId:       string | null
  amount:                number
  merchantName:          string
  memo:                  string | null
  transactionDate:       string
  createdAt:             string
  installmentMonths:     number | null
  totalAmount:           number | null
  installmentEndDate:    string | null
  originalTransactionId: string | null
  category:              TransactionCategory | null
  paymentMethod:         TransactionPaymentMethod | null
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
  merchantName?:     string
  keyword?:          string
}

export interface TransactionPayload {
  merchantName:        string
  amount:              number
  categoryId?:         string | null
  paymentMethodId?:    string | null
  memo?:               string
  transactionDate:     string
  installmentMonths?:  number | null
  totalAmount?:        number | null
  installmentEndDate?: string | null
}

export type HistoryDateTab = '일' | '월' | '년'

export interface HistoryFilter {
  tab:              HistoryDateTab
  date:             Date
  isPeriod:         boolean
  periodEnd:        Date | null
  categoryIds:      string[]
  paymentMethodIds: string[]
  keyword:          string
}

export interface TransactionForm {
  amount:            string
  merchantName:      string
  categoryId:        string
  paymentMethodId:   string
  memo:              string
  transactionDate:   Date
  installmentMonths: string
}

export const transactionsApi = {
  getList: (params: TransactionListParams) =>
    apiClient.get<BasicResponse<Transaction[]> & { pagination: TransactionPagination }>(
      endpoints.transactions.base,
      { params },
    ),

  getById: (id: string) =>
    apiClient.get<BasicResponse<Transaction>>(endpoints.transactions.detail(id)),

  create: (payload: TransactionPayload) =>
    apiClient.post<BasicResponse<Transaction>>(endpoints.transactions.base, payload),

  update: (id: string, payload: Partial<TransactionPayload>) =>
    apiClient.patch<BasicResponse<Transaction>>(endpoints.transactions.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.transactions.detail(id)),
}
