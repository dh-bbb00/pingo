import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/endpoints/users.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.suspend(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers.all }),
    onError:    (error) => handleApiError(error),
  })
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.unsuspend(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers.all }),
    onError:    (error) => handleApiError(error),
  })
}
