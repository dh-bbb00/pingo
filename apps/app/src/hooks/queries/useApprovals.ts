import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { approvalsApi } from '@/api/endpoints/approvals.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'

export function useApprovals() {
  return useQuery({
    queryKey: queryKeys.approvals.list(),
    queryFn:  () => approvalsApi.getList().then((r) => r.data.data),
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approvalsApi.approve(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all }),
    onError:    (error) => handleApiError(error),
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approvalsApi.reject(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all }),
    onError:    (error) => handleApiError(error),
  })
}
