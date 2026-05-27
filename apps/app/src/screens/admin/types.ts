export interface AdminUser {
  id:        string
  email:     string
  role:      'USER' | 'ADMIN'
  createdAt: string
}

export interface ApprovalRequest {
  id:        string
  status:    'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  user:   { id: string; email: string; createdAt: string }
  device: { deviceName: string; phoneModel: string; osVersion: string; appVersion: string }
}
