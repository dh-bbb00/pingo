import { create } from 'zustand'
import { storage, StorageKeys } from '@/utils/storage'

export type UserRole         = 'USER' | 'ADMIN'
export type ApprovalStatus   = 'PENDING' | 'APPROVED' | 'REJECTED'

interface AuthState {
  accessToken:    string | null
  role:           UserRole | null
  approvalStatus: ApprovalStatus | null

  setTokens:    (accessToken: string, refreshToken: string) => void
  setUserInfo:  (role: UserRole, approvalStatus: ApprovalStatus) => void
  clearAuth:    () => void
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

  clearAuth: () => {
    storage.remove(StorageKeys.REFRESH_TOKEN)
    storage.remove(StorageKeys.AUTO_LOGIN)
    set({ accessToken: null, role: null, approvalStatus: null })
  },
}))
