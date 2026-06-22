import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse, ListResponse, PageResponse } from '@/api/types'

export interface AdminUser {
  id:        string
  email:     string
  role:      'USER' | 'ADMIN'
  createdAt: string
}

export interface AdminUserDevice {
  id:         string
  deviceName: string
  phoneModel: string
  osVersion:  string
  appVersion: string
  isTrusted:  boolean
  createdAt:  string
}

export interface AdminUserDetail {
  id:        string
  email:     string
  status:    'APPROVED' | 'SUSPENDED'
  createdAt: string
  devices:   AdminUserDevice[]
}

export interface AdminUsersParams {
  search?:   string
  page?:     number
  pageSize?: number
  status?:   'APPROVED' | 'SUSPENDED'
}

export interface MyInfo {
  id:        string
  email:     string
  role:      string
  status:    string
  createdAt: string
}

export interface MyDevice {
  id:          string
  deviceName:  string
  phoneModel:  string
  isTrusted:   boolean
  isCurrent:   boolean
  createdAt:   string
}

export const usersApi = {
  getAdminList: (params?: AdminUsersParams) =>
    apiClient.get<PageResponse<AdminUserDetail>>(endpoints.users.base, { params }),

  getMe: () =>
    apiClient.get<BasicResponse<MyInfo>>(endpoints.users.me),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch(endpoints.users.password, { currentPassword, newPassword }),

  getMyDevices: () =>
    apiClient.get<ListResponse<MyDevice>>(endpoints.users.myDevices),

  deleteDevice: (id: string) =>
    apiClient.delete(endpoints.users.device(id)),

  saveFcmToken: (fcmToken: string) =>
    apiClient.post(endpoints.users.fcmToken, { fcmToken }),

  suspend: (id: string) =>
    apiClient.patch(endpoints.users.suspend(id)),

  unsuspend: (id: string) =>
    apiClient.patch(endpoints.users.unsuspend(id)),
}
