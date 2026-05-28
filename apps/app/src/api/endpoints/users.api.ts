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

export interface MyInfo {
  id:        string
  email:     string
  role:      string
  status:    string
  createdAt: string
}

export const usersApi = {
  getAdminList: (params?: AdminUsersParams) =>
    apiClient.get<PageResponse<AdminUserDetail>>(endpoints.users.base, { params }),

  getMe: () =>
    apiClient.get<{ success: boolean; data: MyInfo }>(endpoints.users.me),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch(endpoints.users.password, { currentPassword, newPassword }),
}
