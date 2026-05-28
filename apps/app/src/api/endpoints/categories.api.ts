import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface Category {
  id:           string
  name:         string
  color:        string
  icon:         string
  budget:       number | null
  isBudgetFixed: boolean
}

interface CategoryPayload {
  name:          string
  icon:          string
  color:         string
  budget?:       number | null
  isBudgetFixed?: boolean
}

export const categoriesApi = {
  getList: () =>
    apiClient.get<{ success: boolean; data: Category[] }>(endpoints.categories.base),

  create: (payload: CategoryPayload) =>
    apiClient.post<{ success: boolean; data: Category }>(endpoints.categories.base, payload),

  update: (id: string, payload: Partial<CategoryPayload>) =>
    apiClient.patch<{ success: boolean; data: Category }>(endpoints.categories.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.categories.detail(id)),
}
