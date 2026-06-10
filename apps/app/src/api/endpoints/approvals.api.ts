import { apiClient } from '../client'
import { endpoints } from '@/constants/endpoints'
import type { BasicResponse, ListResponse } from '@/api/types'

export interface ApprovalRequest {
  id:        string
  type:      'NEW_USER' | 'NEW_DEVICE'
  status:    'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  user:   { id: string; email: string; createdAt: string }
  device: { deviceName: string; phoneModel: string; osVersion: string; appVersion: string }
}

export type ApprovalStatus = 'PENDING' | 'REJECTED'

export const approvalsApi = {
  getList: (status: ApprovalStatus = 'PENDING') =>
    apiClient.get<ListResponse<ApprovalRequest>>(endpoints.approvals.base, { params: { status } }),

  approve: (id: string) =>
    apiClient.patch<BasicResponse<ApprovalRequest>>(endpoints.approvals.approve(id)),

  reject: (id: string) =>
    apiClient.patch<BasicResponse<ApprovalRequest>>(endpoints.approvals.reject(id)),

  /** 거절된 계정을 수락 (PENDING → APPROVED) — approve 엔드포인트 재사용 */
  accept: (id: string) =>
    apiClient.patch<BasicResponse<ApprovalRequest>>(endpoints.approvals.approve(id)),

  /** 거절된 계정 전체 삭제 (User·Device 포함) — 재신청 가능 상태로 초기화 */
  deleteRequest: (id: string) =>
    apiClient.delete(endpoints.approvals.delete(id)),
}
