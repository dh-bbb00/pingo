import { useMutation } from '@tanstack/react-query'
import { StackActions } from '@react-navigation/native'
import { authApi } from '@/api/endpoints/auth.api'
import { handleApiError } from '@/api/errorHandler'
import { getDeviceInfo } from '@/utils/device'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'

export function useApprovalRequest() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const deviceInfo = await getDeviceInfo()
      return authApi.requestApproval({ ...payload, ...deviceInfo })
    },
    // replace로 이동 — 뒤로가기 시 승인요청 화면으로 돌아오지 않도록
    onSuccess: () => navigationRef.dispatch(StackActions.replace(Screens.Auth.ApprovalPending)),
    onError:   (error) => handleApiError(error),
  })
}
