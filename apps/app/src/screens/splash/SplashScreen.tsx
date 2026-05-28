import React, { useEffect, useMemo } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { apiClient } from '@/api/client'
import { endpoints } from '@/constants/endpoints'
import { useAuthStore } from '@/store/authStore'
import { storage, StorageKeys } from '@/utils/storage'
import { getDeviceId } from '@/utils/device'
import type { RootStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { makeStyles } from './SplashScreen.styles'

const s = strings.splash

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>

export default function SplashScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { setTokens, setUserInfo } = useAuthStore()

  useEffect(() => {
    // 앱 재시작 시 자동 로그인 진입점.
    // refresh token이 있고 autoLogin=true인 경우 /auth/refresh를 호출해 토큰을 재발급받는다.
    // 재발급이 성공하면 만료가 다시 30일 연장된다 (rolling).
    // 30일 동안 앱을 켜지 않으면 refresh token이 만료되어 로그인 화면으로 이동한다.
    async function bootstrap() {
      const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN)
      const autoLogin    = storage.getBoolean(StorageKeys.AUTO_LOGIN)

      // 둘 중 하나라도 없으면 자동 로그인 시도 없이 바로 로그인 화면으로
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
          // 기기 불일치 — access token은 이미 저장됐으므로 DeviceChange에서 그대로 사용
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

    bootstrap()
  }, [navigation, setTokens, setUserInfo])

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{s.logo}</Text>
      <Text style={styles.title}>{s.title}</Text>
    </View>
  )
}
