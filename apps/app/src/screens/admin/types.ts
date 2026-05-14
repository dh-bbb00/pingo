export interface AdminUser {
  id:        string
  email:     string
  role:      'USER' | 'ADMIN'
  createdAt: string
}

export interface ApprovalRequest {
  id:          string
  email:       string
  deviceModel: string
  requestedAt: string
  status:      'PENDING' | 'APPROVED' | 'REJECTED'
}
