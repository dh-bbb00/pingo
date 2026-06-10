import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { transactionsApi } from '@/api/endpoints/transactions.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'
import { strings } from '@/constants/strings'
import type { TransactionForm } from '@/api/endpoints/transactions.api'

const s = strings.transactionEdit

function toPayload(form: TransactionForm) {
  const months       = parseInt(form.installmentMonths || '0', 10)
  const isInstallment = months >= 2
  const total        = Number(form.amount)

  let amount             = total
  let totalAmount: number | null        = null
  let installmentEndDate: string | null = null

  if (isInstallment) {
    // 균등 월 납입금 (2번째 달~) / 첫달에 나머지 흡수
    const monthly = Math.floor(total / months)
    amount        = total - monthly * (months - 1)
    totalAmount   = total

    // 마지막 납부월: 거래일 기준 (months - 1)달 뒤 1일
    const d = form.transactionDate
    installmentEndDate = new Date(d.getFullYear(), d.getMonth() + months - 1, 1).toISOString()
  }

  return {
    merchantName:       form.merchantName.trim(),
    amount,
    categoryId:         form.categoryId      !== '' ? form.categoryId      : null,
    paymentMethodId:    form.paymentMethodId !== '' ? form.paymentMethodId : null,
    memo:               form.memo.trim()        || undefined,
    transactionDate:    form.transactionDate.toISOString(),
    installmentMonths:  isInstallment ? months : null,
    totalAmount,
    installmentEndDate,
  }
}

export function useTransactionById(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id ?? ''),
    queryFn:  async () => { const res = await transactionsApi.getById(id!); return res.data.data },
    enabled:  !!id,
  })
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.stats.all }),
  ])
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    mutationFn: (form: TransactionForm) => transactionsApi.create(toPayload(form)),
    onSuccess: async () => {
      await invalidateAll(queryClient)
      navigation.goBack()
      Toast.show({ type: 'success', text1: s.successCreate })
    },
    onError: (error) => handleApiError(error),
  })
}

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    mutationFn: (form: TransactionForm) => transactionsApi.update(id, toPayload(form)),
    onSuccess: async () => {
      await invalidateAll(queryClient)
      navigation.goBack()
      Toast.show({ type: 'success', text1: s.successUpdate })
    },
    onError: (error) => handleApiError(error),
  })
}

export function useDeleteTransaction(id: string) {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    mutationFn: () => transactionsApi.delete(id),
    onSuccess: async () => {
      await invalidateAll(queryClient)
      navigation.goBack()
      Toast.show({ type: 'success', text1: s.successDelete })
    },
    onError: (error) => handleApiError(error),
  })
}
