import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api/endpoints/users.api'
import { queryKeys } from '@/constants/queryKeys'

export function useMyInfo() {
  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn:  async () => {
      const res = await usersApi.getMe()
      return res.data.data
    },
  })
}
