import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export const categoriesApi = {
  getList: () =>
    apiClient.get<Category[]>(endpoints.categories.base),

  create: (payload: Omit<Category, 'id'>) =>
    apiClient.post<Category>(endpoints.categories.base, payload),

  update: (id: string, payload: Partial<Category>) =>
    apiClient.patch<Category>(endpoints.categories.detail(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.categories.detail(id)),
}
