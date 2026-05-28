import { create } from 'zustand'
import { storage, StorageKeys } from '@/utils/storage'
import { authApi } from '@/api/endpoints/auth.api'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'

export type UserRole         = 'USER' | 'ADMIN'
export type ApprovalStatus   = 'PENDING' | 'APPROVED' | 'REJECTED'

interface AuthState {
  accessToken:          string | null
  role:                 UserRole | null
  approvalStatus:       ApprovalStatus | null
  /** NEW_DEVICE 에러 시 수신한 임시 토큰 — 기기 승인 요청에만 사용, 앱 재시작 시 소멸 */
  deviceAccessToken:    string | null

  setTokens:            (accessToken: string, refreshToken: string) => void
  setDeviceAccessToken: (token: string) => void
  clearDeviceAccessToken: () => void
  setUserInfo:          (role: UserRole, approvalStatus: ApprovalStatus) => void
  logout:               () => Promise<void>
  clearAuth:            () => void
}

function clearLocal() {
  storage.remove(StorageKeys.REFRESH_TOKEN)
  storage.remove(StorageKeys.AUTO_LOGIN)
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken:       null,
  role:              null,
  approvalStatus:    null,
  deviceAccessToken: null,

  setTokens: (accessToken, refreshToken) => {
    storage.set(StorageKeys.REFRESH_TOKEN, refreshToken)
    set({ accessToken })
  },

  setDeviceAccessToken:   (token) => set({ deviceAccessToken: token }),
  clearDeviceAccessToken: ()      => set({ deviceAccessToken: null }),

  setUserInfo: (role, approvalStatus) => set({ role, approvalStatus }),

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // 서버 실패해도 로컬은 항상 클리어
    } finally {
      clearLocal()
      set({ accessToken: null, role: null, approvalStatus: null })
      navigationRef.reset({ index: 0, routes: [{ name: Screens.Root.Auth, params: { screen: Screens.Auth.Login } }] })
    }
  },

  clearAuth: () => {
    clearLocal()
    set({ accessToken: null, role: null, approvalStatus: null })
    navigationRef.reset({ index: 0, routes: [{ name: Screens.Root.Auth, params: { screen: Screens.Auth.Login } }] })
  },
}))
