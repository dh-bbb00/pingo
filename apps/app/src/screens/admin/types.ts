export interface AdminUser {
  id:        string
  email:     string
  role:      'USER' | 'ADMIN'
  createdAt: string
}

export interface AdminUserDevice {
  id:         string
  deviceName: string
  phoneModel: string
  osVersion:  string
  appVersion: string
  isTrusted:  boolean
  createdAt:  string
}

export interface AdminUserDetail {
  id:        string
  email:     string
  status:    'APPROVED' | 'SUSPENDED'
  createdAt: string
  devices:   AdminUserDevice[]
}

export interface ApprovalRequest {
  id:        string
  type:      'NEW_USER' | 'NEW_DEVICE'
  status:    'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  user:   { id: string; email: string; createdAt: string }
  device: { deviceName: string; phoneModel: string; osVersion: string; appVersion: string }
}
