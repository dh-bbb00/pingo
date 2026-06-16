import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { categoriesApi } from '@/api/endpoints/categories.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'
import { strings } from '@/constants/strings'
import type { CategoryForm } from '@/api/endpoints/categories.api'
import { usePendingTransactionStore } from '@/store/pendingTransactionStore'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'

function toPayload(form: CategoryForm) {
  return {
    name:          form.name.trim(),
    icon:          form.icon,
    color:         form.color,
    budget:        form.budget !== '' ? Number(form.budget) : null,
    isBudgetFixed: form.isFixedBudget,
  }
}

export function useCreateCategory(returnToTransaction = false) {
  const queryClient  = useQueryClient()
  const navigation   = useNavigation()
  const pendingStore = usePendingTransactionStore()

  return useMutation({
    mutationFn: (form: CategoryForm) => categoriesApi.create(toPayload(form)),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      Toast.show({ type: 'success', text1: strings.categoryEdit.successCreate })

      if (returnToTransaction) {
        pendingStore.setNewCategoryId(res.data.data.id)
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

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    mutationFn: (form: CategoryForm) => categoriesApi.update(id, toPayload(form)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      navigation.goBack()
      Toast.show({ type: 'success', text1: strings.categoryEdit.successUpdate })
    },
    onError: (error) => handleApiError(error),
  })
}

export function useDeleteCategory(id: string) {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    // replaceCategoryId: 이동할 카테고리 ID, undefined면 null(기타)로 처리
    mutationFn: (replaceCategoryId?: string) => categoriesApi.delete(id, replaceCategoryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      navigation.goBack()
      Toast.show({ type: 'success', text1: strings.categoryEdit.successDelete })
    },
    onError: (error) => handleApiError(error),
  })
}
