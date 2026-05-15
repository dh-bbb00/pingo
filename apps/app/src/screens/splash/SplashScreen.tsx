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
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { styles } from './SplashScreen.styles'

const s = strings.splash

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
      navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.Login })
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
        navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.DeviceChange })
        return
      }

      if (data.approvalStatus === 'PENDING') {
        navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.ApprovalPending })
        return
      }

      if (data.role === 'ADMIN') {
        navigation.replace(Screens.Root.AdminTabs, { screen: Screens.AdminTab.UserManagement })
      } else {
        navigation.replace(Screens.Root.UserTabs, { screen: Screens.UserTab.Home })
      }
    } catch {
      navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.Login })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{s.logo}</Text>
      <Text style={styles.title}>{s.title}</Text>
    </View>
  )
}
