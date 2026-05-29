import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface Category {
  id:           string
  name:         string
  color:        string
  icon:         string
  budget:       number | null
  isBudgetFixed: boolean
  createdAt?:   string
}

export interface CategoryPagination {
  page:        number
  pageSize:    number
  total:       number
  totalPages:  number
  totalBudget: number
}

interface CategoryPayload {
  name:          string
  icon:          string
  color:         string
  budget?:       number | null
  isBudgetFixed?: boolean
}

export interface CategoryListParams {
  page:     number
  pageSize: number
  sort:     string
}

export const categoriesApi = {
  getOne: (id: string) =>
    apiClient.get<{ success: boolean; data: Category }>(endpoints.categories.detail(id)),

  getList: (params: CategoryListParams) =>
    apiClient.get<{ success: boolean; data: Category[]; pagination: CategoryPagination }>(
      endpoints.categories.base,
      { params },
    ),

  create: (payload: CategoryPayload) =>
    apiClient.post<{ success: boolean; data: Category }>(endpoints.categories.base, payload),

  update: (id: string, payload: Partial<CategoryPayload>) =>
    apiClient.patch<{ success: boolean; data: Category }>(endpoints.categories.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.categories.detail(id)),
}
