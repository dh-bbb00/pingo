import Toast from 'react-native-toast-message'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/endpoints/auth.api'
import { handleApiError } from '@/api/errorHandler'
import { ApiErrorCode } from '@/api/errors'
import { getDeviceId } from '@/utils/device'
import { useAuthStore } from '@/store/authStore'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'

export function useLogin() {
  const { setTokens, setUserInfo } = useAuthStore()

  const showGenericInputError = () =>
    Toast.show({ type: 'error', text1: strings.login.invalidInput })

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const deviceUid = await getDeviceId()
      return authApi.login({ ...payload, deviceUid })
    },
    onSuccess: ({ data: resp }) => {
      const { accessToken, refreshToken, role, approvalStatus } = resp.data
      setTokens(accessToken, refreshToken)
      setUserInfo(role, approvalStatus)
      if (role === 'ADMIN') {
        navigationRef.navigate(Screens.Root.AdminTabs, { screen: Screens.AdminTab.UserManagement })
      } else {
        navigationRef.navigate(Screens.Root.UserTabs, { screen: Screens.UserTab.Home })
      }
    },
    onError: (error, variables) => handleApiError(error, {
      [ApiErrorCode.INVALID_CREDENTIALS]: showGenericInputError,
      [ApiErrorCode.VALIDATION_ERROR]:    showGenericInputError,
      // 미등록 기기 — email/password를 params로 넘겨 DeviceChangeScreen에서 승인요청에 재사용
      [ApiErrorCode.NEW_DEVICE]: () =>
        navigationRef.navigate(Screens.Root.Auth, {
          screen: Screens.Auth.DeviceChange,
          params: { email: variables.email, password: variables.password },
        }),
    }),
  })
}
