import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { transactionsApi } from '@/api/endpoints/transactions.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'
import { strings } from '@/constants/strings'
import type { TransactionForm } from '../types'

const s = strings.transactionEdit

function toPayload(form: TransactionForm) {
  return {
    merchantName:    form.merchantName.trim(),
    amount:          Number(form.amount),
    categoryId:      form.categoryId      !== '' ? form.categoryId      : null,
    paymentMethodId: form.paymentMethodId !== '' ? form.paymentMethodId : null,
    memo:            form.memo.trim()        || undefined,
    transactionDate: form.transactionDate.toISOString(),
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
