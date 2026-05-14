const V1 = '/api/v1'

export const endpoints = {
  auth: {
    login:           `${V1}/auth/login`,
    refresh:         `${V1}/auth/refresh`,
    requestApproval: `${V1}/auth/approval-request`,
  },
  transactions: {
    base:   `${V1}/transactions`,
    detail: (id: string) => `${V1}/transactions/${id}`,
  },
  categories: {
    base:   `${V1}/categories`,
    detail: (id: string) => `${V1}/categories/${id}`,
  },
  fixedExpenses: {
    base:   `${V1}/fixed-expenses`,
    detail: (id: string) => `${V1}/fixed-expenses/${id}`,
  },
  stats: {
    base: `${V1}/stats`,
  },
  users: {
    password: `${V1}/users/password`,
  },
  devices: {
    base: `${V1}/devices`,
  },
} as const
