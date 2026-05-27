import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { approvalsApi, type ApprovalStatus } from '@/api/endpoints/approvals.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'

export function useApprovals(status: ApprovalStatus) {
  return useQuery({
    queryKey: queryKeys.approvals.list(status),
    queryFn:  () => approvalsApi.getList(status).then((r) => r.data.data),
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

export function useAcceptRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approvalsApi.accept(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all }),
    onError:    (error) => handleApiError(error),
  })
}

export function useDeleteApprovalRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approvalsApi.deleteRequest(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all }),
    onError:    (error) => handleApiError(error),
  })
}
