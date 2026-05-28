import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api/endpoints/users.api'
import { queryKeys } from '@/constants/queryKeys'

export function useMyDevices() {
  return useQuery({
    queryKey: queryKeys.users.devices,
    queryFn:  async () => {
      const res = await usersApi.getMyDevices()
      // 현재 기기를 항상 맨 앞으로
      return [...res.data.data].sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent))
    },
  })
}
