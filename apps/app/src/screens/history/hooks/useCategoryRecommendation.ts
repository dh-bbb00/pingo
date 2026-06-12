import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '@/api/endpoints/transactions.api'
import { queryKeys } from '@/constants/queryKeys'

/**
 * 동일 가맹점 최근 10건을 조회해 가장 많이 사용된 카테고리를 추천.
 * notificationId 플로우에서만 사용 — enabled는 호출부에서 제어.
 */
export function useCategoryRecommendation(merchantName: string | undefined) {
  return useQuery({
    queryKey: queryKeys.transactions.categoryRecommendation(merchantName ?? ''),
    queryFn:  async () => {
      const res = await transactionsApi.getList({ page: 1, pageSize: 10, merchantName })
      const txList = res.data.data

      const counts: Record<string, number> = {}
      for (const tx of txList) {
        if (tx.categoryId) counts[tx.categoryId] = (counts[tx.categoryId] ?? 0) + 1
      }

      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
      return sorted[0]?.[0] ?? null  // 최다 등장 categoryId, 없으면 null
    },
    enabled: !!merchantName,
    staleTime: 0,  // 항상 최신 내역 기준으로 추천
  })
}
