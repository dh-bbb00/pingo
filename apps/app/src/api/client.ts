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
  // 호출 측에서 Authorization을 명시한 경우(deviceAccessToken 등) 덮어쓰지 않는다
  if (!config.headers.Authorization) {
    const token = useAuthStore.getState().accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 앱 사용 중 accessToken(1h) 만료 시 자동 갱신.
// 401 응답을 받으면 refresh token으로 새 토큰 쌍을 발급받고 원래 요청을 재시도한다.
// 재발급 성공 시 refresh token 만료도 30일 연장된다 (rolling).
// 재발급 실패(refresh token 만료 등)는 clearAuth()로 로컬 토큰만 삭제하며,
// 화면 이동은 하지 않는다 — 이후 네비게이션 흐름에서 자연스럽게 로그인 화면으로 유도된다.
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true // 무한 루프 방지
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
