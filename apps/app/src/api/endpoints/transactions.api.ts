import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface Transaction {
  id: string
  amount: number
  description: string
  categoryId: string
  date: string
  createdAt: string
}

export interface TransactionFilter {
  startDate?: string
  endDate?: string
  categoryId?: string
}

export const transactionsApi = {
  getList: (filter?: TransactionFilter) =>
    apiClient.get<Transaction[]>(endpoints.transactions.base, { params: filter }),

  getById: (id: string) =>
    apiClient.get<Transaction>(endpoints.transactions.detail(id)),

  create: (payload: Omit<Transaction, 'id' | 'createdAt'>) =>
    apiClient.post<Transaction>(endpoints.transactions.base, payload),

  update: (id: string, payload: Partial<Transaction>) =>
    apiClient.patch<Transaction>(endpoints.transactions.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.transactions.detail(id)),
}
