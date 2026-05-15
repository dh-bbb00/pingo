import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/endpoints/auth.api'
import { getDeviceInfo } from '@/utils/device'

export function useApprovalRequest() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const deviceInfo = await getDeviceInfo()
      return authApi.requestApproval({ ...payload, ...deviceInfo })
    },
  })
}
