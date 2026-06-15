import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '@/api/endpoints/transactions.api'
import type { Transaction } from '@/api/endpoints/transactions.api'
import type { ParsedCardNotification } from '@/utils/cardNotificationParser'

/**
 * 취소 알림 정보와 DB 내역 매칭 기준
 * - 할부: totalAmount === cancel.amount, installmentMonths 일치 (알면)
 * - 일시불: amount === cancel.amount
 */
export function matchesCancelInfo(tx: Transaction, parsed: ParsedCardNotification): boolean {
  const txIsInstallment = tx.installmentMonths != null && tx.installmentMonths >= 2
  if (parsed.isInstallment !== txIsInstallment) return false

  if (parsed.isInstallment) {
    if (tx.totalAmount !== parsed.amount) return false
    if (parsed.installmentMonths != null && tx.installmentMonths !== parsed.installmentMonths) return false
  } else {
    if (tx.amount !== parsed.amount) return false
  }

  return true
}

/** 가맹점명 포함 여부 — 알림 파싱 가맹점명이 DB 가맹점명에 포함되거나 그 반대 */
export function merchantIncludes(txMerchant: string, cancelMerchant: string): boolean {
  const a = txMerchant.toLowerCase()
  const b = cancelMerchant.toLowerCase()
  return a.includes(b) || b.includes(a)
}

export function useCancelledTransactionSearch(parsed: ParsedCardNotification | null) {
  return useQuery({
    queryKey: ['cancelSearch', parsed?.merchant, parsed?.amount, parsed?.isInstallment, parsed?.installmentMonths],
    queryFn: async () => {
      if (!parsed) return []
      // merchantName으로 BE contains 검색 → FE에서 금액·결제유형 추가 필터
      const res = await transactionsApi.getList({ page: 1, pageSize: 200, merchantName: parsed.merchant })
      return res.data.data.filter(tx => matchesCancelInfo(tx, parsed))
    },
    enabled: !!parsed,
    staleTime: 0,
  })
}
