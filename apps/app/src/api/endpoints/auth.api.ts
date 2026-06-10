import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse } from '@/api/types'

export interface LoginPayload {
  email: string
  password: string
  deviceUid: string
  appVersion?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  role: 'USER' | 'ADMIN'
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

interface DeviceInfo {
  deviceUid: string; deviceName: string; phoneModel: string; osVersion: string; appVersion: string
}

export interface LoginForm {
  email:     string
  password:  string
  saveEmail: boolean
  autoLogin: boolean
}

export interface ApprovalRequestForm {
  username: string
  password: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<BasicResponse<AuthTokens>>(endpoints.auth.login, payload),

  logout: () =>
    apiClient.delete(endpoints.auth.logout),

  requestApproval: (payload: { email: string; password: string } & DeviceInfo) =>
    apiClient.post(endpoints.auth.requestApproval, payload),

  /** JWT 인증된 유저의 새 기기 승인 요청 — token은 accessToken 또는 deviceAccessToken */
  requestDeviceApproval: (token: string, payload: DeviceInfo) =>
    apiClient.post(endpoints.auth.requestDeviceApproval, payload, {
      headers: { Authorization: `Bearer ${token}` },
    }),
}
