import axios from 'axios'
import { ENV } from '@/config/env'
import { endpoints } from '@/constants/endpoints'
import { storage, StorageKeys } from '@/utils/storage'
import { useAuthStore } from '@/store/authStore'

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN)
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${ENV.API_URL}${endpoints.auth.refresh}`,
            { refreshToken },
          )
          useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return apiClient(original)
        } catch {
          useAuthStore.getState().clearAuth()
        }
      }
    }
    return Promise.reject(error)
  },
)
