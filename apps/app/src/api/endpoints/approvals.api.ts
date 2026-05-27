import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { ApprovalRequest } from '@/screens/admin/types'

interface ListResponse<T> {
  success: boolean
  data: T[]
}

interface BasicResponse<T> {
  success: boolean
  data: T
}

export const approvalsApi = {
  getList: () =>
    apiClient.get<ListResponse<ApprovalRequest>>(endpoints.approvals.base),

  approve: (id: string) =>
    apiClient.patch<BasicResponse<ApprovalRequest>>(endpoints.approvals.approve(id)),

  reject: (id: string) =>
    apiClient.patch<BasicResponse<ApprovalRequest>>(endpoints.approvals.reject(id)),
}
