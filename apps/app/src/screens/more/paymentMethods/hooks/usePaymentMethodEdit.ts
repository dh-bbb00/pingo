import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { paymentMethodsApi } from '@/api/endpoints/paymentMethods.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'
import { strings } from '@/constants/strings'
import { usePendingTransactionStore } from '@/store/pendingTransactionStore'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'

const s = strings.paymentMethods

export function useCreatePaymentMethod(returnToTransaction: boolean) {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()
  const pendingStore = usePendingTransactionStore()

  return useMutation({
    mutationFn: (payload: { name: string; cardNumber?: string; isDefault?: boolean }) =>
      paymentMethodsApi.create(payload),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.all })
      Toast.show({ type: 'success', text1: s.successCreate })

      if (returnToTransaction) {
        // 새로 만든 카드 ID를 저장하고 내역 등록 화면으로 복귀
        pendingStore.setNewPaymentMethodId(res.data.data.id)
        navigationRef.navigate(Screens.Root.UserTabs as any, {
          screen: Screens.UserTab.History,
          params: { screen: Screens.History.TransactionEdit },
        })
      } else {
        navigation.goBack()
      }
    },
    onError: (error) => handleApiError(error),
  })
}

export function useUpdatePaymentMethod(id: string) {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    mutationFn: (payload: { name?: string; cardNumber?: string; isDefault?: boolean }) =>
      paymentMethodsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.all })
      navigation.goBack()
      Toast.show({ type: 'success', text1: s.successUpdate })
    },
    onError: (error) => handleApiError(error),
  })
}

export function useDeletePaymentMethod(id: string) {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    mutationFn: () => paymentMethodsApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.all })
      navigation.goBack()
      Toast.show({ type: 'success', text1: s.successDelete })
    },
    onError: (error) => handleApiError(error),
  })
}
