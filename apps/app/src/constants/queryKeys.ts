export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    list: (filter?: unknown) => ['transactions', 'list', filter] as const,
    detail: (id: string) => ['transactions', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list:   (sort?: string) => ['categories', 'list', sort] as const,
    detail: (id: string)   => ['categories', id] as const,
  },
  fixedExpenses: {
    all: ['fixed-expenses'] as const,
    list: () => ['fixed-expenses', 'list'] as const,
  },
  stats: {
    all: ['stats'] as const,
    monthly: (year: number, month: number) => ['stats', year, month] as const,
  },
  adminUsers: {
    all:  ['admin-users'] as const,
    list: (params?: unknown) => ['admin-users', 'list', params] as const,
  },
  approvals: {
    all:  ['approvals'] as const,
    list: (status?: string) => ['approvals', 'list', status] as const,
  },
  users: {
    me:      ['users', 'me'] as const,
    devices: ['users', 'devices'] as const,
  },
} as const
