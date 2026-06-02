import { useInfiniteQuery } from '@tanstack/react-query'
import { transactionsApi } from '@/api/endpoints/transactions.api'
import { queryKeys } from '@/constants/queryKeys'

const PAGE_SIZE = 20

export interface TransactionFilter {
  startDate?:        string
  endDate?:          string
  categoryIds?:      string[]
  paymentMethodIds?: string[]
}

export function useTransactions(filter: TransactionFilter) {
  return useInfiniteQuery({
    queryKey: queryKeys.transactions.list(filter),
    queryFn: ({ pageParam }) =>
      transactionsApi.getList({ ...filter, page: pageParam, pageSize: PAGE_SIZE }).then(r => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}
