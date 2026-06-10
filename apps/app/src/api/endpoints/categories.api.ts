import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse } from '@/api/types'

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

export interface CategoryForm {
  name:          string
  budget:        string
  isFixedBudget: boolean
  icon:          string
  color:         string
}

export type CategorySort =
  | 'budget_asc' | 'budget_desc'
  | 'name_asc'   | 'name_desc'
  | 'date_asc'   | 'date_desc'

export const categoriesApi = {
  getOne: (id: string) =>
    apiClient.get<BasicResponse<Category>>(endpoints.categories.detail(id)),

  getList: (params: CategoryListParams) =>
    apiClient.get<BasicResponse<Category[]> & { pagination: CategoryPagination }>(
      endpoints.categories.base,
      { params },
    ),

  create: (payload: CategoryPayload) =>
    apiClient.post<BasicResponse<Category>>(endpoints.categories.base, payload),

  update: (id: string, payload: Partial<CategoryPayload>) =>
    apiClient.patch<BasicResponse<Category>>(endpoints.categories.detail(id), payload),

  delete: (id: string, replaceCategoryId?: string) =>
    apiClient.delete(endpoints.categories.detail(id), {
      data: replaceCategoryId ? { replaceCategoryId } : {},
    }),
}
