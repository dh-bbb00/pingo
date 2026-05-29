import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { categoriesApi } from '@/api/endpoints/categories.api'
import { handleApiError } from '@/api/errorHandler'
import { queryKeys } from '@/constants/queryKeys'
import { strings } from '@/constants/strings'
import type { CategoryForm } from '../types'

function toPayload(form: CategoryForm) {
  return {
    name:          form.name.trim(),
    icon:          form.icon,
    color:         form.color,
    budget:        form.budget !== '' ? Number(form.budget) : null,
    isBudgetFixed: form.isFixedBudget,
  }
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const navigation  = useNavigation()

  return useMutation({
    mutationFn: (form: CategoryForm) => categoriesApi.create(toPayload(form)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      navigation.goBack()
      Toast.show({ type: 'success', text1: strings.categoryEdit.successCreate })
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
