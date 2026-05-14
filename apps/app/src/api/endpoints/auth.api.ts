import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

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

interface BasicResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<BasicResponse<AuthTokens>>(endpoints.auth.login, payload),

  requestApproval: (payload: { email: string; password: string; deviceUid: string; deviceName: string; phoneModel: string; osVersion: string; appVersion: string }) =>
    apiClient.post(endpoints.auth.requestApproval, payload),
}
