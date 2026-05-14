import { create } from 'zustand'
import { storage, StorageKeys } from '@/utils/storage'
import { authApi } from '@/api/endpoints/auth.api'
import { navigationRef } from '@/navigation/navigationRef'

export type UserRole         = 'USER' | 'ADMIN'
export type ApprovalStatus   = 'PENDING' | 'APPROVED' | 'REJECTED'

interface AuthState {
  accessToken:    string | null
  role:           UserRole | null
  approvalStatus: ApprovalStatus | null

  setTokens:    (accessToken: string, refreshToken: string) => void
  setUserInfo:  (role: UserRole, approvalStatus: ApprovalStatus) => void
  logout:       () => Promise<void>
  clearAuth:    () => void
}

function clearLocal() {
  storage.remove(StorageKeys.REFRESH_TOKEN)
  storage.remove(StorageKeys.AUTO_LOGIN)
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken:    null,
  role:           null,
  approvalStatus: null,

  setTokens: (accessToken, refreshToken) => {
    storage.set(StorageKeys.REFRESH_TOKEN, refreshToken)
    set({ accessToken })
  },

  setUserInfo: (role, approvalStatus) => set({ role, approvalStatus }),

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // 서버 실패해도 로컬은 항상 클리어
    } finally {
      clearLocal()
      set({ accessToken: null, role: null, approvalStatus: null })
      navigationRef.reset({ index: 0, routes: [{ name: 'Auth', params: { screen: 'Login' } }] })
    }
  },

  clearAuth: () => {
    clearLocal()
    set({ accessToken: null, role: null, approvalStatus: null })
  },
}))
