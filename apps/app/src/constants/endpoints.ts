const V1 = '/api/v1'

export const endpoints = {
  auth: {
    login:                  `${V1}/auth/login`,
    refresh:                `${V1}/auth/refresh`,
    logout:                 `${V1}/auth/logout`,
    requestApproval:        `${V1}/auth/approval-request`,
    requestDeviceApproval:  `${V1}/auth/request-device-approval`,
  },
  transactions: {
    base:   `${V1}/transactions`,
    detail: (id: string) => `${V1}/transactions/${id}`,
  },
  categories: {
    base:   `${V1}/categories`,
    detail: (id: string) => `${V1}/categories/${id}`,
  },
  paymentMethods: {
    base:   `${V1}/payment-methods`,
    detail: (id: string) => `${V1}/payment-methods/${id}`,
  },
  fixedExpenses: {
    base:             `${V1}/fixed-expenses`,
    detail:           (id: string) => `${V1}/fixed-expenses/${id}`,
    thisMonthStatus:  (id: string) => `${V1}/fixed-expenses/${id}/this-month-status`,
    registerThisMonth:(id: string) => `${V1}/fixed-expenses/${id}/register-this-month`,
  },
  stats: {
    base:        `${V1}/stats`,
    homeSummary: `${V1}/stats/home-summary`,
    byCategory:  `${V1}/stats/by-category`,
    byDate:      `${V1}/stats/by-date`,
    byMonth:     `${V1}/stats/by-month`,
    byHour:      `${V1}/stats/by-hour`,
    top10:       `${V1}/stats/top10`,
  },
  users: {
    base:      `${V1}/users`,
    me:        `${V1}/users/me`,
    password:  `${V1}/users/me/password`,
    myDevices: `${V1}/users/me/devices`,
    device:    (id: string) => `${V1}/users/me/devices/${id}`,
    fcmToken:  `${V1}/users/me/device/fcm-token`,
    suspend:   (id: string) => `${V1}/users/${id}/suspend`,
    unsuspend: (id: string) => `${V1}/users/${id}/unsuspend`,
  },
  devices: {
    base: `${V1}/devices`,
  },
  approvals: {
    base:    `${V1}/approvals`,
    approve: (id: string) => `${V1}/approvals/${id}/approve`,
    reject:  (id: string) => `${V1}/approvals/${id}/reject`,
    delete:  (id: string) => `${V1}/approvals/${id}`,
  },
  scheduler: {
    runMonthly:     `${V1}/scheduler/run-monthly`,
    runByType:      (type: string) => `${V1}/scheduler/run-monthly/${type}`,
    logs:           `${V1}/scheduler/logs`,
    currentMonth:   `${V1}/scheduler/logs/current-month`,
    notRun:         `${V1}/scheduler/logs/not-run`,
    logDetail:      (id: string) => `${V1}/scheduler/logs/${id}`,
  },
} as const
