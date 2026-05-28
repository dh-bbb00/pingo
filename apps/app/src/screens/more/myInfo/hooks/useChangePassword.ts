import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { usersApi } from '@/api/endpoints/users.api'
import { handleApiError } from '@/api/errorHandler'
import { parseApiError } from '@/api/errors'

export function useChangePassword(onWrongPassword: (message: string) => void) {
  const navigation = useNavigation()

  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      return await usersApi.changePassword(currentPassword, newPassword)
    },
    onSuccess: async (res: any) => {
      Toast.show({ type: 'success', text1: res?.data?.message })
      navigation.goBack()
    },
    onError: (error) => {
      const { message } = parseApiError(error)
      if (message) onWrongPassword(message)
      else handleApiError(error)
    },
  })
}
