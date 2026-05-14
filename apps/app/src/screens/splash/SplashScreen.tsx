import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { apiClient } from '@/api/client'
import { endpoints } from '@/constants/endpoints'
import { useAuthStore } from '@/store/authStore'
import { storage, StorageKeys } from '@/utils/storage'
import { getDeviceId } from '@/utils/device'
import type { RootStackParamList } from '@/types/navigation'
import { styles } from './SplashScreen.styles'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>

export default function SplashScreen() {
  const navigation = useNavigation<Nav>()
  const { setTokens, setUserInfo } = useAuthStore()

  useEffect(() => {
    bootstrap()
  }, [])

  async function bootstrap() {
    const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN)
    const autoLogin    = storage.getBoolean(StorageKeys.AUTO_LOGIN)

    if (!refreshToken || !autoLogin) {
      navigation.replace('Auth', { screen: 'Login' })
      return
    }

    try {
      const { data } = await apiClient.post<{
        accessToken:    string
        refreshToken:   string
        role:           'USER' | 'ADMIN'
        approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
        deviceId:       string
      }>(endpoints.auth.refresh, { refreshToken })

      setTokens(data.accessToken, data.refreshToken)
      setUserInfo(data.role, data.approvalStatus)

      const currentDeviceId = await getDeviceId()
      if (data.deviceId && data.deviceId !== currentDeviceId) {
        navigation.replace('Auth', { screen: 'DeviceChange' })
        return
      }

      if (data.approvalStatus === 'PENDING') {
        navigation.replace('Auth', { screen: 'ApprovalPending' })
        return
      }

      if (data.role === 'ADMIN') {
        navigation.replace('AdminTabs', { screen: 'UserManagement' })
      } else {
        navigation.replace('UserTabs', { screen: 'Home' })
      }
    } catch {
      navigation.replace('Auth', { screen: 'Login' })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>P</Text>
      <Text style={styles.title}>Pingo</Text>
    </View>
  )
}
