import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { AdminUserDetail } from '@/screens/admin/types'

interface PageResponse<T> {
  success:    boolean
  data:       T[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

export interface AdminUsersParams {
  search?:   string
  page?:     number
  pageSize?: number
}

export const usersApi = {
  getAdminList: (params?: AdminUsersParams) =>
    apiClient.get<PageResponse<AdminUserDetail>>(endpoints.users.base, { params }),
}
