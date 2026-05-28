import { useQuery } from '@tanstack/react-query'
import { usersApi, type AdminUsersParams } from '@/api/endpoints/users.api'
import { queryKeys } from '@/constants/queryKeys'

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: queryKeys.adminUsers.list(params),
    queryFn:  async () => {
      const res = await usersApi.getAdminList(params)
      return res.data
    },
  })
}
