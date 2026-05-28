import { useMutation } from '@tanstack/react-query'
import { StackActions } from '@react-navigation/native'
import { authApi } from '@/api/endpoints/auth.api'
import { handleApiError } from '@/api/errorHandler'
import { useAuthStore } from '@/store/authStore'
import { getDeviceInfo } from '@/utils/device'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'

export function useDeviceApprovalRequest() {
  const { deviceAccessToken, accessToken, clearDeviceAccessToken } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      // 로그인 NEW_DEVICE 토큰 우선, 없으면 자동 로그인 accessToken (스플래시 케이스)
      const token = (deviceAccessToken ?? accessToken)!
      const deviceInfo = await getDeviceInfo()
      return authApi.requestDeviceApproval(token, deviceInfo)
    },
    onSuccess: () => {
      clearDeviceAccessToken()
      navigationRef.dispatch(StackActions.replace(Screens.Auth.ApprovalPending))
    },
    onError: (error) => {
      clearDeviceAccessToken()
      handleApiError(error)
    },
  })
}
