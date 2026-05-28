import { useQueryClient, useMutation } from '@tanstack/react-query'
import { usersApi } from '@/api/endpoints/users.api'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'

export function useDeleteDevice() {
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async ({ deviceId }: { deviceId: string; isCurrent: boolean }) => {
      return await usersApi.deleteDevice(deviceId)
    },
    onSuccess: (_, { isCurrent }) => {
      if (isCurrent) {
        clearAuth()
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.devices })
      }
    },
    onError: (error) => handleApiError(error),
  })
}
