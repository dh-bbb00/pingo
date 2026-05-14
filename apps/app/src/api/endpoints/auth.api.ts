import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthTokens>(endpoints.auth.login, payload),

  requestApproval: (payload: { deviceId: string; deviceModel: string }) =>
    apiClient.post(endpoints.auth.requestApproval, payload),
}
