import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsApi, TransactionFilter } from '@/api/endpoints/transactions.api'
import { queryKeys } from '@/constants/queryKeys'

export function useTransactions(filter?: TransactionFilter) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filter),
    queryFn: async () => {
      const res = await transactionsApi.getList(filter)
      return res.data
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
    },
  })
}
