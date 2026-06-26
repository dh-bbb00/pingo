import Toast from 'react-native-toast-message'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/endpoints/auth.api'
import { handleApiError } from '@/api/errorHandler'
import { ApiErrorCode, parseApiError } from '@/api/errors'
import { getDeviceId } from '@/utils/device'
import { useAuthStore } from '@/store/authStore'
import { navigationRef, resetToTransactionEdit, resetToCancelSearch } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { storage, StorageKeys } from '@/utils/storage'
import messaging from '@react-native-firebase/messaging'
import { usersApi } from '@/api/endpoints/users.api'

export function useLogin() {
  const { setTokens, setUserInfo, setDeviceAccessToken } = useAuthStore()

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
      messaging().getToken()
        .then(fcmToken => usersApi.saveFcmToken(fcmToken))
        .catch(() => {})
      if (role === 'ADMIN') {
        navigationRef.navigate(Screens.Root.AdminTabs, { screen: Screens.AdminTab.UserManagement })
      } else {
        const pendingCancelId = storage.getString(StorageKeys.PENDING_CANCEL_DEEPLINK)
        if (pendingCancelId) {
          storage.remove(StorageKeys.PENDING_CANCEL_DEEPLINK)
          resetToCancelSearch(pendingCancelId)
          return
        }

        const pendingNotificationId = storage.getString(StorageKeys.PENDING_DEEPLINK)
        if (pendingNotificationId) {
          storage.remove(StorageKeys.PENDING_DEEPLINK)
          resetToTransactionEdit(pendingNotificationId)
        } else {
          navigationRef.navigate(Screens.Root.UserTabs, { screen: Screens.UserTab.Home })
        }
      }
    },
    onError: (error) => handleApiError(error, {
      [ApiErrorCode.INVALID_CREDENTIALS]: showGenericInputError,
      [ApiErrorCode.VALIDATION_ERROR]:    showGenericInputError,
      [ApiErrorCode.NEW_DEVICE]: () => {
        const { deviceAccessToken } = parseApiError(error)
        if (deviceAccessToken) setDeviceAccessToken(deviceAccessToken)
        navigationRef.navigate(Screens.Root.Auth, { screen: Screens.Auth.DeviceChange })
      },
    }),
  })
}
